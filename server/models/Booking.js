const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ["pending", "confirmed", "canceled"], default: "pending" },
    paymentStatus: { type: String, enum: ["on-hold", "released", "refunded"], default: "on-hold" },
    qrCode: { type: String },
    transactionId: { type: String, default: null },
    adminFeePercentage: { type: Number, default: 4 },
    hostPayoutStatus: { type: String, enum: ["pending", "completed"], default: "pending" },
    isCheckedIn: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
