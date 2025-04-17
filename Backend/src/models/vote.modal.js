import mongoose, { Schema } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
const votingSchema = new Schema({
  debateId: {
    type: Schema.Types.ObjectId,
    ref: 'DebateRoom',
    required: true,
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  voteType: {
    type: String,
    enum: ['upvote', 'downvote'],
    default: 'upvote'
  },
  value: {
    type: Number,
    enum: [1, -1],
    default: 1
  }
}, { timestamps: true });

// 🧩 Ensure one vote per user per debate
votingSchema.index({ userId: 1, debateId: 1 }, { unique: true });

// 🧮 Get vote count
votingSchema.statics.getVoteCount = async function(debateId) {
  const result = await this.aggregate([
    { $match: { debateId: mongoose.Types.ObjectId(debateId) } },
    {
      $group: {
        _id: null,
        upvotes: { $sum: { $cond: [{ $gt: ["$value", 0] }, 1, 0] } },
        downvotes: { $sum: { $cond: [{ $lt: ["$value", 0] }, 1, 0] } },
        total: { $sum: "$value" }
      }
    }
  ]);

  return result.length > 0 ? result[0] : { upvotes: 0, downvotes: 0, total: 0 };
};

// ✔️ Check if user already voted
votingSchema.statics.hasUserVoted = function(userId, debateId) {
  return this.findOne({ userId, debateId }).exec();
};

export const Voting = mongoose.model('Voting', votingSchema);
