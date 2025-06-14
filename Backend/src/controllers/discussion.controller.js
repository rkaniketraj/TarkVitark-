// Discussion controller for debate platform
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { DebateRoom } from "../models/debateRoom.modal.js";
import { User } from "../models/user.modal.js";

// Get all active debates (status: 'active')
const getActiveDebates = asyncHandler(async (req, res) => {
  const debates = await DebateRoom.find({ status: 'active' })
    .populate('host', 'fullName username avatar')
    .sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, debates, "Active debates fetched successfully"));
});

// Get all upcoming debates (status: 'scheduled')
const getUpcomingDebates = asyncHandler(async (req, res) => {
  const debates = await DebateRoom.find({ status: 'scheduled' })
    .populate('host', 'fullName username avatar')
    .sort({ scheduledAt: 1 });
  return res.status(200).json(new ApiResponse(200, debates, "Upcoming debates fetched successfully"));
});

// Register user for a debate (with stance and rules agreement)
const registerForDebate = asyncHandler(async (req, res) => {
  const { debateId, stance } = req.body;
  if (!debateId || !stance) throw new ApiError(400, "Debate ID and stance required");
  const debate = await DebateRoom.findById(debateId);
  if (!debate) throw new ApiError(404, "Debate not found");
  if (debate.participants.includes(req.user._id)) {
    return res.status(200).json(new ApiResponse(200, debate, "Already registered"));
  }
  debate.participants.push(req.user._id);
  // Optionally store stance in a separate model or in participants array as object
  await debate.save();
  return res.status(200).json(new ApiResponse(200, debate, "Registered for debate"));
});

// Get details for a specific debate
const getDebateDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const debate = await DebateRoom.findById(id)
    .populate('host', 'fullName username avatar')
    .populate('participants', 'fullName username avatar');
  if (!debate) throw new ApiError(404, "Debate not found");
  return res.status(200).json(new ApiResponse(200, debate, "Debate details fetched"));
});

// Create a new debate (host a session)
const createDebate = asyncHandler(async (req, res) => {
  const { title, description, scheduledAt } = req.body;
  if (!title || !description || !scheduledAt) throw new ApiError(400, "All fields required");
  const debate = await DebateRoom.create({
    title,
    description,
    scheduledAt,
    host: req.user._id,
    status: 'scheduled',
    participants: [req.user._id],
  });
  return res.status(201).json(new ApiResponse(201, debate, "Debate created successfully"));
});

// List debates hosted by the user
const getHostedDebates = asyncHandler(async (req, res) => {
  const debates = await DebateRoom.find({ host: req.user._id })
    .sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, debates, "Hosted debates fetched"));
});

// List debates user has participated in
const getParticipatedDebates = asyncHandler(async (req, res) => {
  const debates = await DebateRoom.find({ participants: req.user._id })
    .sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, debates, "Participated debates fetched"));
});

export {
  getActiveDebates,
  getUpcomingDebates,
  registerForDebate,
  getDebateDetails,
  createDebate,
  getHostedDebates,
  getParticipatedDebates,
};
