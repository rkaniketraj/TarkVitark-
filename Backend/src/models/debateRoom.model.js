import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const { Schema } = mongoose;

const debateRoomSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  host: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  participants: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    stance: {
      type: String,
      enum: ['in_favor', 'against', 'neutral'],
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'ended', 'cancelled'],
    default: 'upcoming',
    index: true
  },
  scheduledAt: {
    type: Date,
    required: [true, 'Debate schedule time is required'],
    validate: {
      validator: function(v) {
        return v > new Date();
      },
      message: 'Debate must be scheduled for a future date'
    }
  },
  duration: {
    type: Number,
    required: [true, 'Debate duration is required'],
    min: [15, 'Debate must be at least 15 minutes'],
    max: [180, 'Debate cannot exceed 180 minutes'],
    default: 60
  },
  maxParticipants: {
    type: Number,
    required: true,
    min: [2, 'Minimum 2 participants required'],
    max: [100, 'Maximum 100 participants allowed'],
    default: 10
  },
  category: {
    type: String,
    required: true,
    enum: ['politics', 'technology', 'science', 'culture', 'economics', 'other'],
    index: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  language: {
    type: String,
    required: true,
    default: 'en'
  },
  statistics: {
    totalMessages: { type: Number, default: 0 },
    totalVotes: { type: Number, default: 0 },
    forVotes: { type: Number, default: 0 },
    againstVotes: { type: Number, default: 0 }
  },
  rules: {
    allowSpectators: { type: Boolean, default: true },
    requireApproval: { type: Boolean, default: false },
    allowVoiceMessages: { type: Boolean, default: true }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


// Add mongoose-aggregate-paginate-v2 plugin
debateRoomSchema.plugin(mongooseAggregatePaginate);

// Indexes
debateRoomSchema.index({ title: 'text', description: 'text' });
debateRoomSchema.index({ scheduledAt: 1, status: 1 });
debateRoomSchema.index({ 'participants.user': 1 });
debateRoomSchema.index({ category: 1, scheduledAt: -1 });

// Virtual for participant count
debateRoomSchema.virtual('participantCount').get(function() {
  return this.participants.length;
});

// Methods
debateRoomSchema.methods.isParticipant = function(userId) {
  return this.participants.some(p => p.user.toString() === userId.toString());
};

debateRoomSchema.methods.canJoin = function() {
  return this.status === 'upcoming' && this.participants.length < this.maxParticipants;
};

debateRoomSchema.methods.addParticipant = async function(userId, stance) {
  if (!this.canJoin()) {
    throw new Error('Cannot join debate at this time');
  }
  
  if (this.isParticipant(userId)) {
    throw new Error('Already a participant');
  }

  this.participants.push({ user: userId, stance });
  return this.save();
};

debateRoomSchema.methods.removeParticipant = async function(userId) {
  if (!this.isParticipant(userId)) {
    throw new Error('Not a participant');
  }

  this.participants = this.participants.filter(p => p.user.toString() !== userId.toString());
  return this.save();
};

// Pre-save middleware
debateRoomSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Ensure host is also a participant
    if (!this.participants.some(p => p.user.toString() === this.host.toString())) {
      this.participants.push({
        user: this.host,
        stance: 'neutral',
        joinedAt: new Date()
      });
    }
  }

  // Update statistics
  this.statistics.totalVotes = this.statistics.forVotes + this.statistics.againstVotes;

  next();
});

// Static methods
debateRoomSchema.statics.findActive = function() {
  return this.find({ 
    status: 'ongoing',
    scheduledAt: { $lte: new Date() }
  }).sort('-scheduledAt');
};

debateRoomSchema.statics.findUpcoming = function() {
  return this.find({ 
    status: 'upcoming',
    scheduledAt: { $gt: new Date() }
  }).sort('scheduledAt');
};

export const DebateRoom = mongoose.model('DebateRoom', debateRoomSchema);
