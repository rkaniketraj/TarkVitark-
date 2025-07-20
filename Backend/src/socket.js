
// import { Server } from 'socket.io';
// import mongoose from 'mongoose';
// import { DebateRoom } from './models/debateRoom.model.js';

// export default function setupSocket(server) {
//   const io = new Server(server, {
//     cors: {
//       origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
//       credentials: true,
//     },
//   });

//   // Room data: { [roomId]: { participants: [{ username, stance }], messages: [] } }
//   const rooms = {};

//   io.on('connection', (socket) => {
//     // Join a debate room
//     socket.on('joinRoom', async ({ roomId, userId, username, stance }) => {
//       // Check if user is a registered participant in the debate room
//       try {
//         const room = await DebateRoom.findById(roomId).lean();
//         if (!room) {
//           socket.emit('error', { message: 'Room not found.' });
//           return;
//         }
//         const isParticipant = room.participants.some(
//           (p) => p.toString() === userId
//         );
//         if (!isParticipant) {
//           socket.emit('error', { message: 'You are not a registered participant for this debate.' });
//           return;
//         }
//         socket.join(roomId);
//         if (!rooms[roomId]) {
//           rooms[roomId] = { participants: [], messages: [] };
//         }
//         // Add participant if not already present (in-memory for socket tracking)
//         if (!rooms[roomId].participants.find(p => p.userId === userId)) {
//           rooms[roomId].participants.push({ userId, username, stance });
//         }
//         io.to(roomId).emit('roomUpdate', { participants: rooms[roomId].participants });
//         socket.emit('receiveMessage', ...rooms[roomId].messages);
//       } catch (err) {
//         socket.emit('error', { message: 'Server error joining room.' });
//       }
//     });

//     // Handle sending messages
//     socket.on('sendMessage', async (data) => {
//       const { roomId, message, userId, username, stance, timestamp } = data;
//       // Check if user is a registered participant in the debate room
//       try {
//         const room = await DebateRoom.findById(roomId).lean();
//         if (!room) return;
//         const isParticipant = room.participants.some(
//           (p) => p.toString() === userId
//         );
//         if (!isParticipant) return;
//         const msgObj = { user: { name: username, stance }, text: message, timestamp };
//         if (rooms[roomId]) {
//           rooms[roomId].messages.push(msgObj);
//           io.to(roomId).emit('receiveMessage', msgObj);
//         }
//       } catch (err) {
//         // Optionally emit error
//       }
//     });

//     // Handle disconnect (optional: remove participant)
//     socket.on('disconnecting', () => {
//       for (const roomId of socket.rooms) {
//         if (rooms[roomId]) {
//           rooms[roomId].participants = rooms[roomId].participants.filter(p => p.socketId !== socket.id);
//           io.to(roomId).emit('roomUpdate', { participants: rooms[roomId].participants });
//         }
//       }
//     });
//   });
//   return io;
// }

// // so if i take if know the participate from the soccket does we dont need to store in db


import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { DebateRoom } from './models/debateRoom.model.js';
// --- Step 1: Import the Message model ---
import Message from './models/message.model.js'; 

export default function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      credentials: true,
    }
  });

  // This should only track who is currently online, not the whole message history.
  const rooms = {}; 

  io.on('connection', (socket) => {
    // We should attach the user info to the socket object for easier access
    // This assumes your auth middleware provides req.user
    socket.user = { 
        id: socket.handshake.query.userId, 
        username: socket.handshake.query.username, 
        stance: socket.handshake.query.stance 
    };

    socket.on('joinRoom', async ({ roomId }) => {
      try {
        const room = await DebateRoom.findById(roomId).lean();
        if (!room) {
          return socket.emit('error', { message: 'Room not found.' });
        }

        const isParticipant = room.participants.some(p => p.toString() === socket.user.id);
        if (!isParticipant) {
          return socket.emit('error', { message: 'You are not a registered participant.' });
        }

        socket.join(roomId);

        // This part is for tracking online users, which is fine.
        if (!rooms[roomId]) {
          rooms[roomId] = { participants: [] };
        }
        if (!rooms[roomId].participants.some(p => p.id === socket.user.id)) {
          rooms[roomId].participants.push(socket.user);
        }

        io.to(roomId).emit('roomUpdate', { participants: rooms[roomId].participants });
        
        // --- IMPORTANT ---
        // We no longer send message history from here.
        // The client will fetch history via a separate API call.

      } catch (err) {
        socket.emit('error', { message: 'Server error joining room.' });
      }
    });

    // --- Step 2: Modify sendMessage to save to the database ---
    socket.on('sendMessage', async (data) => {
      const { roomId, content } = data; // Simplified data from client
      console.log('Backend received "sendMessage" event with data:', data);
      
      try {
        // Authorization check is good practice
        const room = await DebateRoom.findById(roomId).lean();
        if (!room || !room.participants.some(p => p.toString() === socket.user.id)) {
          return socket.emit('error', { message: 'Not authorized to send messages here.' });
        }

        // Save the new message to the database
        const newMessage = await Message.create({
          debateId: roomId,
          content: content,
          sender: socket.user.id,
        });
        console.log('Message successfully saved to DB:', newMessage);
        // Populate sender info to send back to clients
        await newMessage.populate('sender', 'username avatar');

        // Broadcast the message (retrieved from DB) to everyone in the room
        console.log('Broadcasting "receiveMessage" back to room:', roomId);
        io.to(roomId).emit('receiveMessage', newMessage);

      } catch (err) {
        console.error("Message Error:", err);
        socket.emit('error', { message: 'Failed to send message.' });
      }
    });

    socket.on('disconnecting', () => {
      // This logic is mostly for tracking online users and can be refined
      // But it's not critical for message persistence
      for (const roomId of socket.rooms) {
        if (rooms[roomId] && socket.user) {
          rooms[roomId].participants = rooms[roomId].participants.filter(p => p.id !== socket.user.id);
          io.to(roomId).emit('roomUpdate', { participants: rooms[roomId].participants });
        }
      }
    });
  });

  return io;
}