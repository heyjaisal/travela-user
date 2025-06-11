const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  participantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  participantModel: {
    type: String,
    enum: ["User", "Host"],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ["User", "Host"],
    required: true,
  },
});

const conversationSchema = new mongoose.Schema(
  {
    participants: {
      type: [participantSchema],
      validate: [
        (val) => val.length === 2,
        "A conversation must have exactly 2 participants",
      ],
    },
    lastMessage: { type: String },
    lastMessageAt: { type: Date },
  },
  { timestamps: true }
);


conversationSchema.index({ "participants.participantId": 1 });

module.exports = mongoose.model("Conversation", conversationSchema);
