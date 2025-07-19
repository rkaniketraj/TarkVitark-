import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Debate from "../models/debateRegistration.model.js";

// Function to update debate status
const updateDebateStatus = async () => {
    const currentTime = new Date();
    
    // Update debates that should be active
    await Debate.updateMany(
        {
            startTime: { $lte: currentTime },
            status: 'upcoming'
        },
        {
            $set: { status: 'active' }
        }
    );

    // Update debates that should be completed
    await Debate.updateMany(
        {
            endTime: { $lte: currentTime },
            status: 'active'
        },
        {
            $set: { status: 'completed' }
        }
    );
};

// Create a new debate
const createDebate = asyncHandler(async (req, res) => {
    const { title, description, startTime, duration, category } = req.body;
    
    if (!title || !description || !startTime || !duration || !category) {
        throw new ApiError(400, "All fields are required");
    }

    // Calculate end time based on duration
    const startDate = new Date(startTime);
    const endTime = new Date(startDate.getTime() + duration * 60000); // Convert duration from minutes to milliseconds

    const debate = await Debate.create({
        title,
        description,
        startTime: startDate,
        endTime,
        duration,
        category,
        createdBy: req.user._id,
        status: 'upcoming'
    });

    return res.status(201).json(
        new ApiResponse(201, debate, "Debate created successfully")
    );
});

// Register for a debate
const registerForDebate = asyncHandler(async (req, res) => {
    const { debateId, stance, agreedToRules } = req.body;
    
    if (!debateId || !stance || !agreedToRules) {
        throw new ApiError(400, "Debate ID, stance, and rules agreement are required");
    }

    if (!['for', 'against'].includes(stance)) {
        throw new ApiError(400, "Invalid stance. Must be 'for' or 'against'");
    }

    const debate = await Debate.findById(debateId).select('+participants');
    if (!debate) {
        throw new ApiError(404, "Debate not found");
    }

    if (debate.status !== 'upcoming') {
        throw new ApiError(400, "Can only register for upcoming debates");
    }

    // Check if user is already registered
    const isRegistered = debate.participants.some(p => p.user.toString() === req.user._id.toString());
    if (isRegistered) {
        throw new ApiError(400, "Already registered for this debate");
    }

    // Check if max participants reached
    if (debate.participants.length >= debate.maxParticipants) {
        throw new ApiError(400, "Debate has reached maximum participants");
    }

    // Check if stance has reached its limit
    const stanceCount = debate.participants.filter(p => p.stance === stance).length;
    const maxPerStance = Math.floor(debate.maxParticipants / 2);
    
    if (stanceCount >= maxPerStance) {
        throw new ApiError(400, `Maximum participants for ${stance} stance reached`);
    }

    debate.participants.push({
        user: req.user._id,
        stance,
        agreedToRules,
        joinedAt: new Date()
    });

    try {
        // Use save options to handle concurrency
        await debate.save({ 
            new: true,
            runValidators: true
        });
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            throw new ApiError(400, "Registration conflict. Please try again.");
        }
        throw error;
    }

    return res.status(200).json(
        new ApiResponse(200, debate, "Successfully registered for debate")
    );
});

// Get active debates
const getActiveDebates = asyncHandler(async (req, res) => {
    const currentTime = new Date();
    
    const debates = await Debate.find({
        startTime: { $lte: currentTime },
        endTime: { $gt: currentTime },
        status: 'active'
    }).populate('createdBy participants.user', 'username');

    return res.status(200).json(
        new ApiResponse(200, debates, "Active debates fetched successfully")
    );
});

// Get upcoming debates
const getUpcomingDebates = asyncHandler(async (req, res) => {
    const currentTime = new Date();
    
    const debates = await Debate.find({
        startTime: { $gt: currentTime },
        status: 'upcoming'
    }).populate('createdBy participants.user', 'username');

    return res.status(200).json(
        new ApiResponse(200, debates, "Upcoming debates fetched successfully")
    );
});

// Join an active debate
const joinDebate = asyncHandler(async (req, res) => {
    const { debateId } = req.body;
    
    if (!debateId) {
        throw new ApiError(400, "Debate ID is required");
    }

    const debate = await Debate.findById(debateId);
    if (!debate) {
        throw new ApiError(404, "Debate not found");
    }

    if (debate.status !== 'active') {
        throw new ApiError(400, "This debate is not active");
    }

    // Check if user is registered
    const isRegistered = debate.participants.some(p => p.user.toString() === req.user._id.toString());
    if (!isRegistered) {
        throw new ApiError(400, "You must be registered to join this debate");
    }

    return res.status(200).json(
        new ApiResponse(200, debate, "Successfully joined debate")
    );
});

// Get debate details
const getDebateDetails = asyncHandler(async (req, res) => {
    const { debateId } = req.params;
    
    const debate = await Debate.findById(debateId)
        .populate('createdBy participants.user', 'username');
    
    if (!debate) {
        throw new ApiError(404, "Debate not found");
    }

    return res.status(200).json(
        new ApiResponse(200, debate, "Debate details fetched successfully")
    );
});

export {
    createDebate,
    registerForDebate,
    getActiveDebates,
    getUpcomingDebates,
    joinDebate,
    getDebateDetails,
    updateDebateStatus
};


