const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    contentType: {
      type: String,
      enum: ["Event", "Property"],
      required: true,
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "contentType",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    reasons: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved", "dismissed"],
      default: "pending",
    },
    adminNote: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
