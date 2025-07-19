import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Debate from './models/debateRegistration.model.js';
import { User } from './models/user.model.js';
import Message from './models/message.model.js';

let io;

export function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
            credentials: true,
            methods: ['GET', 'POST'],
        },
    });

    // Middleware to authenticate socket connections
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
            
            if (!token) {
                return next(new Error('Authentication required'));
            }

            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded._id).select('-password');
            
            if (!user) {
                return next(new Error('User not found'));
            }

            socket.user = user;
            next();
        } catch (error) {
            next(new Error('Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.user.username}`);

        // Join a debate room
        socket.on('joinDebate', async ({ debateId }) => {
            try {
                const debate = await Debate.findById(debateId);
                
                if (!debate) {
                    socket.emit('error', { message: 'Debate not found' });
                    return;
                }

                // Check if user is registered for this debate
                const isParticipant = debate.participants.some(
                    p => p.user.toString() === socket.user._id.toString()
                );

                if (!isParticipant) {
                    socket.emit('error', { message: 'You must be registered to join this debate' });
                    return;
                }

                socket.join(debateId);
                socket.emit('joinedDebate', { debate });

                // Notify others in the room
                socket.to(debateId).emit('userJoined', {
                    username: socket.user.username,
                    userId: socket.user._id
                });

                // Update debate status if needed
                if (debate.status === 'upcoming' && new Date() >= debate.startTime) {
                    debate.status = 'active';
                    await debate.save();
                    io.to(debateId).emit('debateStatusUpdate', debate);
                } else if (debate.status === 'active' && new Date() >= debate.endTime) {
                    debate.status = 'completed';
                    await debate.save();
                    io.to(debateId).emit('debateStatusUpdate', debate);
                }

            } catch (error) {
                console.error('Error joining debate:', error);
                socket.emit('error', { message: 'Failed to join debate' });
            }
        });

        // Handle sending messages
        socket.on('sendMessage', async ({ debateId, message }) => {
            try {
                const debate = await Debate.findById(debateId);
                if (!debate || debate.status !== 'active') {
                    socket.emit('error', { message: 'Cannot send message - debate is not active' });
                    return;
                }

                const newMessage = await Message.create({
                    debate: debateId,
                    sender: socket.user._id,
                    content: message,
                    stance: debate.participants.find(
                        p => p.user.toString() === socket.user._id.toString()
                    )?.stance
                });

                const populatedMessage = await Message.findById(newMessage._id)
                    .populate('sender', 'username');

                io.to(debateId).emit('newMessage', populatedMessage);

            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // Leave debate room
        socket.on('leaveDebate', ({ debateId }) => {
            socket.leave(debateId);
            socket.to(debateId).emit('userLeft', {
                username: socket.user.username,
                userId: socket.user._id
            });
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.user.username}`);
        });
    });

    // Start debate status checker
    const updateDebateStatuses = async () => {
        try {
            const currentTime = new Date();

            // Find and activate debates whose start time has passed
            const upcomingToActive = await Debate.updateMany(
                { status: 'upcoming', startTime: { $lte: currentTime } },
                { $set: { status: 'active' } }
            );

            // Find and complete debates whose end time has passed
            const activeToCompleted = await Debate.updateMany(
                { status: 'active', endTime: { $lte: currentTime } },
                { $set: { status: 'completed' } }
            );

            // Notify rooms of status changes
            const activatedDebates = await Debate.find({ status: 'active', startTime: { $lte: currentTime } });
            activatedDebates.forEach(debate => {
                io.to(debate._id.toString()).emit('debateStatusUpdate', {
                    _id: debate._id,
                    status: 'active'
                });
            });

            const completedDebates = await Debate.find({ status: 'completed', endTime: { $lte: currentTime } });
            completedDebates.forEach(debate => {
                io.to(debate._id.toString()).emit('debateStatusUpdate', {
                    _id: debate._id,
                    status: 'completed'
                });
            });
        } catch (error) {
            console.error('Error in debate status checker:', error);
        }
    };

    setInterval(updateDebateStatuses, 60000); // Check every minute
    updateDebateStatuses(); // Run immediately on start
}

export function getIO() {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
}

