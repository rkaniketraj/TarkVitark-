// // Message controller for debate platform
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import mongoose from "mongoose";
// import Message from "../models/message.model.js";
// import { DebateRoom } from "../models/debateRoom.model.js";

// // Get all messages for a debate
// const getMessagesForDebate = asyncHandler(async (req, res) => {
//   const { debateId } = req.params;
//   if (!debateId) throw new ApiError(400, "Debate ID required");
//   const messages = await Message.find({ debateId })
//     .populate('sender', 'fullName username avatar')
//     .sort({ createdAt: 1 });
//   return res.status(200).json(new ApiResponse(200, messages, "Messages fetched"));
// });

// // Send a message to a debate (text or voice)
// const sendMessage = asyncHandler(async (req, res) => {
//   const { content, voiceUrl } = req.body;
//   const { debateId } = req.params;
//   if (!debateId || (!content && !voiceUrl)) throw new ApiError(400, "Message content required");
//   const debate = await DebateRoom.findById(debateId);
//   if (!debate) throw new ApiError(404, "Debate not found");
//   const message = await Message.create({
//     debateId,
//     sender: req.user._id,
//     content: content || '',
//     voiceUrl: voiceUrl || null
//   });
//   return res.status(201).json(new ApiResponse(201, message, "Message sent"));
// });

// export {
//   getMessagesForDebate,
//   sendMessage,
// };

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import Message from "../models/message.model.js";
import { DebateRoom } from "../models/debateRoom.model.js";

// This function will be called by the frontend when the chat page loads.
const getMessagesForDebate = asyncHandler(async (req, res) => {
  const { debateId } = req.params;
  const userId = req.user._id; // Get the current user's ID from auth middleware

  if (!mongoose.isValidObjectId(debateId)) {
    throw new ApiError(400, "Invalid Debate ID provided");
  }

  // --- CORRECTION 1: Add Authorization Check ---
  // First, find the debate room.
  const debate = await DebateRoom.findById(debateId);
  if (!debate) {
    throw new ApiError(404, "Debate room not found");
  }

  // Then, check if the current user is in the participants array.
  const isParticipant = debate.participants.some(p => p.equals(userId));
  if (!isParticipant) {
    throw new ApiError(403, "You are not authorized to view this chat history");
  }

  // --- CORRECTION 2: Use the correct field name from your message model ---
  // The field is 'debateRoom', not 'debateId'.
  const messages = await Message.find({ debateRoom: debateId })
    .populate('sender', 'fullName username avatar') // Populates sender's info
    .sort({ createdAt: 'asc' }); // Sorts from oldest to newest

  return res.status(200).json(new ApiResponse(200, messages, "Messages fetched successfully"));
});

// The sendMessage function is removed because we handle real-time message
// sending through socket.js for instant delivery to all clients.

export {
  getMessagesForDebate,
};