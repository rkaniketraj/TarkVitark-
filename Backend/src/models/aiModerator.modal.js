// aiFlagLog.js - AI Moderation Flag Log Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const aiFlagLogSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  debateId: {
    type: Schema.Types.ObjectId,
    ref: 'DebateRoom',
    required: true,
    index: true
  },
  messageId: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
    index: true
    // Optional, so no required: true
  },
  transcriptId: {
    type: Schema.Types.ObjectId,
    ref: 'Transcript', // Assuming there's a Transcript model
    index: true
    // Optional, so no required: true
  },
  type: {
    type: String,
    enum: ['hate_speech', 'toxicity', 'interrupt'],
    required: true,
    index: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  actionTaken: {
    type: String,
    enum: ['warned', 'muted', 'banned'],
    required: true
  },
  content: {
    type: String,
    // Store the flagged content for review
  },
  reviewStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'dismissed'],
    default: 'pending'
  },
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
aiFlagLogSchema.index({ debateId: 1, type: 1, createdAt: -1 });
aiFlagLogSchema.index({ userId: 1, type: 1, createdAt: -1 });
aiFlagLogSchema.index({ type: 1, score: -1, createdAt: -1 });

// Static method to find high severity flags
aiFlagLogSchema.statics.findHighSeverityFlags = function(threshold = 0.8) {
  return this.find({ score: { $gte: threshold } })
    .sort({ createdAt: -1 })
    .populate('userId', 'username email')
    .populate('debateId', 'title')
    .exec();
};

// Static method to get user violation history
aiFlagLogSchema.statics.getUserViolationHistory = function(userId) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .exec();
};

// Static method to get flags by debate
aiFlagLogSchema.statics.getDebateFlags = function(debateId) {
  return this.find({ debateId })
    .sort({ createdAt: -1 })
    .exec();
};

// Static method to get recent flags for review
aiFlagLogSchema.statics.getRecentFlagsForReview = function(limit = 50) {
  return this.find({ reviewStatus: 'pending' })
    .sort({ score: -1, createdAt: -1 })
    .limit(limit)
    .populate('userId', 'username email')
    .populate('debateId', 'title')
    .exec();
};

// Static method to generate moderation stats
aiFlagLogSchema.statics.generateModerationStats = async function(timeframe = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - timeframe);
  
  return this.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    { $group: {
        _id: '$type',
        count: { $sum: 1 },
        avgScore: { $avg: '$score' },
        actions: {
          $push: {
            action: '$actionTaken',
            score: '$score'
          }
        }
      }
    },
    { $project: {
        _id: 0,
        type: '$_id',
        count: 1,
        avgScore: 1,
        warningCount: {
          $size: {
            $filter: {
              input: '$actions',
              as: 'action',
              cond: { $eq: ['$$action.action', 'warned'] }
            }
          }
        },
        muteCount: {
          $size: {
            $filter: {
              input: '$actions',
              as: 'action',
              cond: { $eq: ['$$action.action', 'muted'] }
            }
          }
        },
        banCount: {
          $size: {
            $filter: {
              input: '$actions',
              as: 'action',
              cond: { $eq: ['$$action.action', 'banned'] }
            }
          }
        }
      }
    }
  ]);
};

const AIFlagLog = mongoose.model('AIFlagLog', aiFlagLogSchema);

module.exports = AIFlagLog;