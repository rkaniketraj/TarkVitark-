// Message controller for debate platform
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import Message from "../models/message.model.js";
import { DebateRoom } from "../models/debateRoom.model.js";

// Get all messages for a debate
const getMessagesForDebate = asyncHandler(async (req, res) => {
  const { debateId } = req.params;
  if (!debateId) throw new ApiError(400, "Debate ID required");
  const messages = await Message.find({ debateId })
    .populate('sender', 'fullName username avatar')
    .sort({ createdAt: 1 });
  return res.status(200).json(new ApiResponse(200, messages, "Messages fetched"));
});

// Send a message to a debate (text or voice)
const sendMessage = asyncHandler(async (req, res) => {
  const { content, voiceUrl } = req.body;
  const { debateId } = req.params;
  if (!debateId || (!content && !voiceUrl)) throw new ApiError(400, "Message content required");
  const debate = await DebateRoom.findById(debateId);
  if (!debate) throw new ApiError(404, "Debate not found");
  const message = await Message.create({
    debateId,
    sender: req.user._id,
    content: content || '',
    voiceUrl: voiceUrl || null
  });
  return res.status(201).json(new ApiResponse(201, message, "Message sent"));
});

export {
  getMessagesForDebate,
  sendMessage,
};
