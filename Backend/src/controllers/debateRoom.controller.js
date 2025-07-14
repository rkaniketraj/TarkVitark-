import { DebateRoom } from '../models/debateRoom.model.js';

export const createDebateRoom = async (req, res) => {
  try {
    const { name, description, scheduledAt, participants } = req.body;
    if (!name || !description || !scheduledAt || !participants || !Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ message: 'All fields (name, description, scheduledAt, participants) are required.' });
    }
    // The first participant is the host
    const host = participants[0];
    const newRoom = await DebateRoom.create({
      title: name,
      description,
      scheduledAt,
      host,
      participants
    });
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create debate room', error: error.message });
  }
};
