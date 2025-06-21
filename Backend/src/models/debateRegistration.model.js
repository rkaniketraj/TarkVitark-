import mongoose from "mongoose";
const Schema = mongoose.Schema;

const participantSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  stance: {
    type: String,
    enum: ["in_favor", "against"],
    required: true,
  },
  agreedToRules: {
    type: Boolean,
    default: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  }
}, { _id: false });

const debateRegistrationSchema = new Schema({
  debate: {
    type: Schema.Types.ObjectId,
    ref: "DebateRoom",
    required: true,
  },
  participant: participantSchema,
  status: {
    type: String,
    enum: ["active", "left", "banned"],
    default: "active"
  },
  activityLog: [{
    action: {
      type: String,
      enum: ["joined", "left", "warned", "banned"],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    reason: String,
  }],
}, {
  timestamps: true,
});

// Compound index for efficient queries
debateRegistrationSchema.index({ debate: 1, "participant.user": 1 }, { unique: true });

// Only one registration per user per debate
debateRegistrationSchema.pre("save", async function(next) {
  if (this.isNew) {
    const existingReg = await this.constructor.findOne({
      debate: this.debate,
      "participant.user": this.participant.user,
    });
    if (existingReg) {
      throw new Error("User already registered for this debate");
    }
  }
  next();
});

const DebateRegistration = mongoose.model("DebateRegistration", debateRegistrationSchema);

export default DebateRegistration;
