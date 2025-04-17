import mongoose from "mongoose";

const followSchema = new mongoose.Schema({
  follower: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  following: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  followedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Optional but recommended indexes for faster querying
followSchema.index({ follower: 1 });
followSchema.index({ following: 1 });

const Follow = mongoose.model("Follow", followSchema);
export default Follow;
