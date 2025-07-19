// Discussion controller for debate platform
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { DebateRoom } from "../models/debateRoom.model.js";
import { User } from "../models/user.model.js";
import DebateRegistration from "../models/debateRegistration.model.js";

// Get all active debates (status: 'active')
const getActiveDebates = asyncHandler(async (req, res) => {
  const debates = await DebateRoom.find({ status: 'ongoing' })
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
  const { debateId, stance, agreedToRules } = req.body;

  // Validate required fields
  if (!debateId) {
    throw new ApiError(400, "Debate ID is required");
  }
  if (!stance || !['in_favor', 'against'].includes(stance)) {
    throw new ApiError(400, "Valid stance is required");
  }
  if (!agreedToRules) {
    throw new ApiError(400, "Must agree to debate rules");
  }

  // Get debate details and verify it's open for registration
  const debate = await DebateRoom.findById(debateId);
  if (!debate) {
    throw new ApiError(404, "Debate not found");
  }

  if (debate.status !== "scheduled") {
    throw new ApiError(400, "This debate is not open for registration");
  }

  try {
    // Create registration record
    const registration = await DebateRegistration.create({
      debate: debateId,
      participant: {
        user: req.user._id,
        stance,
        agreedToRules
      },
      activityLog: [{
        action: "joined"
      }]
    });

    // Add user to debate participants if not already there
    if (!debate.participants.includes(req.user._id)) {
      debate.participants.push(req.user._id);
      await debate.save();
    }

    // Return success response
    return res.status(200).json(
      new ApiResponse(200, registration, "Successfully registered for debate")
    );
  } catch (error) {
    // Check for duplicate registration error
    if (error.message === "User already registered for this debate") {
      throw new ApiError(400, error.message);  
    }
    throw error;
  }
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

// Join a debate (placeholder)
const joinDebate = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, null, "Joined debate (not implemented)"));
});

// Leave a debate (placeholder)
const leaveDebate = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, null, "Left debate (not implemented)"));
});

// Update debate status (placeholder)
const updateDebateStatus = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, null, "Debate status updated (not implemented)"));
});

// Vote on a debate (placeholder)
const voteOnDebate = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, null, "Voted on debate (not implemented)"));
});

// Get debate results (placeholder)
const getDebateResults = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, null, "Debate results (not implemented)"));
});

// Get messages for a debate (placeholder)
const getDebateMessages = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, [], "Debate messages fetched (not implemented)"));
});

// Send a message in a debate (placeholder)
const sendMessage = asyncHandler(async (req, res) => {
  return res.status(201).json(new ApiResponse(201, null, "Message sent (not implemented)"));
});

export {
  getActiveDebates,
  getUpcomingDebates,
  registerForDebate,
  getDebateDetails,
  createDebate,
  getHostedDebates,
  getParticipatedDebates,
  joinDebate,
  leaveDebate,
  updateDebateStatus,
  voteOnDebate,
  getDebateResults,
  getDebateMessages,
  sendMessage,
};
