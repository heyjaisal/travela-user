const mongoose = require('mongoose');

const ticketBookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  ticketsBooked: { type: Number, required: true, min: 1 },
  totalAmount: { type: Number, required: true },
  bookingStatus: { type: String, enum: ['pending', 'confirmed', 'canceled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['on-hold', 'released', 'refunded'], default: 'on-hold' },
  qrCode: { type: String },
  adminFeePercentage: { type: Number, default: 4 },
  hostPayoutStatus: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  isCheckedIn: { type: Boolean, default: false },
  transactionId: { type: String, default: null },
  bookedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const TicketBooking = mongoose.model('TicketBooking', ticketBookingSchema);
module.exports = TicketBooking;