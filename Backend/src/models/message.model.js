import mongoose from "mongoose";
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  debateId: {
    type: Schema.Types.ObjectId,
    ref: 'DebateRoom',
    required: true,
    index: true
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  translatedText: {
    type: Map,
    of: String,
    default: {}
  },
  
  flagged: {
    type: Boolean,
    default: false
  },
  // createdAt: {
  //   type: Date,
  //   default: Date.now
  // }
}, {
  timestamps: true
});

// Index for efficient queries
messageSchema.index({ debateId: 1, createdAt: 1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ flagged: 1 }, { sparse: true });

// Virtual field to determine message age
messageSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt;
});

// Method to add translation
messageSchema.methods.addTranslation = function(langCode, text) {
  this.translatedText.set(langCode, text);
  return this.save();
};

// Static method to find recent messages in a debate
messageSchema.statics.findRecentByDebate = function(debateId, limit = 50) {
  return this.find({ debateId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('sender', 'username avatar')
    .exec();
};

const Message = mongoose.model('Message', messageSchema);
export default Message;