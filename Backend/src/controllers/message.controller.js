// Message controller for debate platform
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import Message from "../models/message.modal.js";
import { DebateRoom } from "../models/debateRoom.modal.js";

// Get all messages for a debate
const getMessagesForDebate = asyncHandler(async (req, res) => {
  const { debateId } = req.params;
  if (!debateId) throw new ApiError(400, "Debate ID required");
  const messages = await Message.find({ debateId })
    .populate('userId', 'fullName username avatar')
    .sort({ createdAt: 1 });
  return res.status(200).json(new ApiResponse(200, messages, "Messages fetched"));
});

// Send a message to a debate (text or voice)
const sendMessage = asyncHandler(async (req, res) => {
  const { debateId, text, voiceUrl } = req.body;
  if (!debateId || (!text && !voiceUrl)) throw new ApiError(400, "Message content required");
  const debate = await DebateRoom.findById(debateId);
  if (!debate) throw new ApiError(404, "Debate not found");
  const message = await Message.create({
    debateId,
    userId: req.user._id,
    text,
    voiceUrl,
  });
  return res.status(201).json(new ApiResponse(201, message, "Message sent"));
});

export {
  getMessagesForDebate,
  sendMessage,
};
