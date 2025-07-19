// //  controller for  platform
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import mongoose from "mongoose";
// // import  from "../models/.model.js"; // Uncomment when model is created

// // Example: Create a new 
// const create = asyncHandler(async (req, res) => {
//   // const { amount, lender, borrower, dueDate, description } = req.body;
//   // if (!amount || !lender || !borrower) {
//   //   throw new ApiError(400, "Required fields missing");
//   // }
//   // const  = await .create({ amount, lender, borrower, dueDate, description });
//   // return res.status(201).json(new ApiResponse(201, , " created successfully"));
//   return res.status(501).json(new ApiResponse(501, null, "Not implemented"));
// });

// // Example: Get all s for a user
// const getUsers = asyncHandler(async (req, res) => {
//   // const userId = req.user._id;
//   // const s = await .find({ $or: [{ lender: userId }, { borrower: userId }] });
//   // return res.status(200).json(new ApiResponse(200, s, "User s fetched successfully"));
//   return res.status(501).json(new ApiResponse(501, null, "Not implemented"));
// });

// // Example: Mark a  as paid
// const markAsPaid = asyncHandler(async (req, res) => {
//   // const { Id } = req.params;
//   // const  = await .findByIdAndUpdate(Id, { status: "paid" }, { new: true });
//   // if (!) throw new ApiError(404, " not found");
//   // return res.status(200).json(new ApiResponse(200, , " marked as paid"));
//   return res.status(501).json(new ApiResponse(501, null, "Not implemented"));
// });

// export {
//   create,
//   getUsers,
//   markAsPaid,
// };


import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { DebateRoom } from "../models/debateRoom.model.js";
import  DebateRegistration  from "../models/debateRegistration.model.js";

// Create a new debate
const createDebate = asyncHandler(async (req, res) => {
  const { title, description, start_time } = req.body;

  if (!title || !description || !start_time) {
    throw new ApiError(400, "All fields are required");
  }

  const debate = await DebateRoom.create({
    title,
    description,
    start_time,
    moderator: req.user._id,
    participants: []
  });

  return res.status(201).json(new ApiResponse(201, debate, "Debate created successfully"));
});

// Get upcoming debates
const getUpcomingDebates = asyncHandler(async (req, res) => {
  const now = new Date();
  const debates = await DebateRoom.find({ start_time: { $gte: now } })
    .sort({ start_time: 1 });
  return res.status(200).json(new ApiResponse(200, debates, "Upcoming debates fetched"));
});

// Register for a debate
const registerForDebate = asyncHandler(async (req, res) => {
  const { debateId, stance, agreedToRules } = req.body;
  const userId = req.user._id;

  if (!debateId || !stance || agreedToRules !== true) {
    throw new ApiError(400, "Missing required fields or rules not agreed to");
  }

  // Check if debate exists
  const debate = await DebateRoom.findById(debateId);
  if (!debate) {
    throw new ApiError(404, "Debate not found");
  }

  // Check if user is already registered
  const existingRegistration = await DebateRegistration.findOne({
    debate: debateId,
    user: userId
  });

  if (existingRegistration) {
    throw new ApiError(400, "You are already registered for this debate");
  }

  // Create registration and update debate participants
  const registration = await DebateRegistration.create({
    debate: debateId,
    user: userId,
    stance,
    agreedToRules
  });

  // Update debate participants
  debate.participants.push({ user: userId, stance });
  await debate.save();

  return res.status(201).json(
    new ApiResponse(201, registration, "Successfully registered for debate")
  );
});

export {
  createDebate,
  getUpcomingDebates,
  registerForDebate
};


