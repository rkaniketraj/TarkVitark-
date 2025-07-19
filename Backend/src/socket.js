
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { DebateRoom } from './models/debateRoom.model.js';

export default function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      credentials: true,
    },
  });

  // Room data: { [roomId]: { participants: [{ username, stance }], messages: [] } }
  const rooms = {};

  io.on('connection', (socket) => {
    // Join a debate room
    socket.on('joinRoom', async ({ roomId, userId, username, stance }) => {
      // Check if user is a registered participant in the debate room
      try {
        const room = await DebateRoom.findById(roomId).lean();
        if (!room) {
          socket.emit('error', { message: 'Room not found.' });
          return;
        }
        const isParticipant = room.participants.some(
          (p) => p.toString() === userId
        );
        if (!isParticipant) {
          socket.emit('error', { message: 'You are not a registered participant for this debate.' });
          return;
        }
        socket.join(roomId);
        if (!rooms[roomId]) {
          rooms[roomId] = { participants: [], messages: [] };
        }
        // Add participant if not already present (in-memory for socket tracking)
        if (!rooms[roomId].participants.find(p => p.userId === userId)) {
          rooms[roomId].participants.push({ userId, username, stance });
        }
        io.to(roomId).emit('roomUpdate', { participants: rooms[roomId].participants });
        socket.emit('receiveMessage', ...rooms[roomId].messages);
      } catch (err) {
        socket.emit('error', { message: 'Server error joining room.' });
      }
    });

    // Handle sending messages
    socket.on('sendMessage', async (data) => {
      const { roomId, message, userId, username, stance, timestamp } = data;
      // Check if user is a registered participant in the debate room
      try {
        const room = await DebateRoom.findById(roomId).lean();
        if (!room) return;
        const isParticipant = room.participants.some(
          (p) => p.toString() === userId
        );
        if (!isParticipant) return;
        const msgObj = { user: { name: username, stance }, text: message, timestamp };
        if (rooms[roomId]) {
          rooms[roomId].messages.push(msgObj);
          io.to(roomId).emit('receiveMessage', msgObj);
        }
      } catch (err) {
        // Optionally emit error
      }
    });

    // Handle disconnect (optional: remove participant)
    socket.on('disconnecting', () => {
      for (const roomId of socket.rooms) {
        if (rooms[roomId]) {
          rooms[roomId].participants = rooms[roomId].participants.filter(p => p.socketId !== socket.id);
          io.to(roomId).emit('roomUpdate', { participants: rooms[roomId].participants });
        }
      }
    });
  });
  return io;
}

// so if i take if know the participate from the soccket does we dont need to store in db