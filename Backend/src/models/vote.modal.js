// voting.js - Voting Model Schema for debate platform
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const votingSchema = new Schema({
  // MongoDB automatically creates _id field, no need to declare it
  
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
  // Optional fields for more comprehensive voting functionality
  voteType: {
    type: String,
    enum: ['upvote', 'downvote', 'agree', 'disagree', 'neutral'],
    default: 'upvote'
  },
  targetType: {
    type: String,
    enum: ['debate', 'argument', 'message'],
    default: 'debate'
  },
  targetId: {
    type: Schema.Types.ObjectId,
    refPath: 'targetType',
    default: null
  },
  value: {
    type: Number,
    default: 1,
    min: -1,
    max: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to ensure one vote per user per debate item
votingSchema.index({ userId: 1, debateId: 1, targetType: 1, targetId: 1 }, { unique: true });

// Index for aggregating votes efficiently
votingSchema.index({ debateId: 1, targetType: 1, targetId: 1 });

// Static method to get vote count for a debate item
votingSchema.statics.getVoteCount = async function(debateId, targetType = 'debate', targetId = null) {
  const match = {
    debateId: mongoose.Types.ObjectId(debateId),
    targetType: targetType
  };
  
  if (targetId) {
    match.targetId = mongoose.Types.ObjectId(targetId);
  }
  
  const result = await this.aggregate([
    { $match: match },
    { $group: {
        _id: null,
        upvotes: {
          $sum: { $cond: [{ $gt: ["$value", 0] }, 1, 0] }
        },
        downvotes: {
          $sum: { $cond: [{ $lt: ["$value", 0] }, 1, 0] }
        },
        total: {
          $sum: "$value"
        }
      }
    }
  ]);
  
  return result.length > 0 ? result[0] : { upvotes: 0, downvotes: 0, total: 0 };
};

// Method to check if a user has voted
votingSchema.statics.hasUserVoted = function(userId, debateId, targetType = 'debate', targetId = null) {
  const query = {
    userId,
    debateId,
    targetType
  };
  
  if (targetId) {
    query.targetId = targetId;
  }
  
  return this.findOne(query).exec();
};

const Voting = mongoose.model('Voting', votingSchema);

module.exports = Voting;