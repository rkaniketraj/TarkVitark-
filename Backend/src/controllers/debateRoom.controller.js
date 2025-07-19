
import { DebateRoom } from '../models/debateRoom.model.js';

export const createDebateRoom = async (req, res) => {
  try {
    const { title, description, scheduledAt, duration, host, participants } = req.body;
    if (!title || !description || !scheduledAt || !duration || !host || !participants || !Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ message: 'All fields (title, description, scheduledAt, duration, host, participants) are required.' });
    }

    // Validate participants array
    const validParticipants = participants.every(p => p.user && p.stance);
    if (!validParticipants) {
      return res.status(400).json({ message: 'Each participant must have user and stance.' });
    }

    const newRoom = await DebateRoom.create({
      title,
      description,
      scheduledAt,
      duration,
      host,
      participants,
      status: 'upcoming'
    });
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create debate room', error: error.message });
  }
};
