const mongoose = require('mongoose');
const { Schema } = mongoose;

const debateRoomSchema = new Schema({
  title: 
  {
    type: String,
    required: true
  },
  description:
  {
    type:String,
    required: true
  } ,
  host: 
  {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  participants: 
  [
    {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
],
 
  status: {
    type: String,
    enum: ['ongoing', 'scheduled', 'ended'],
    default: 'scheduled'
  },
  scheduledAt: 
  {
    type: Date
  },
  for: {
    type: Number,
    default: 0
  },
  against: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('DebateRoom', debateRoomSchema);
