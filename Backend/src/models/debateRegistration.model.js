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

const debateSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true // in minutes
    },
    endTime: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["upcoming", "active", "completed"],
        default: "upcoming"
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    participants: [participantSchema],
    maxParticipants: {
        type: Number,
        default: 10
    },
    rules: {
        type: [String],
        default: [
            "Be respectful to all participants",
            "No hate speech or offensive language",
            "Stay on topic",
            "One person speaks at a time"
        ]
    }
}, {
    timestamps: true
});


// Compound index for efficient queries
debateSchema.index({ title: 1, "participants.user": 1 }, { unique: false });

const Debate = mongoose.model("Debate", debateSchema);

export default Debate;
