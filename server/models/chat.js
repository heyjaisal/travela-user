const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "senderModel" },
    receiverId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "receiverModel" },
    senderModel: { type: String, required: true, enum: ["User", "Host"] },
    receiverModel: { type: String, required: true, enum: ["User", "Host"] },
    message: { type: String, default: "" },
    fileUrl: { type: String, default: "" },
    messageType: { type: String, enum: ["text", "image", "video", "audio", "file"], required: true },
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
