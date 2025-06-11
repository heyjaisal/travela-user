const mongoose = require('mongoose');

const propertyBookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'Host', required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  bookingStatus: { type: String, enum: ['pending', 'confirmed', 'canceled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['on-hold', 'released', 'refunded'], default: 'on-hold' },
  refundStatus: { type: String, enum: ['requested', 'processed', 'none'], default: 'none' },
hostCompensatedAmount: { type: Number, default: 0 },
hostPayoutStatus: { type: String, enum: ['pending', 'partial', 'completed', 'canceled'], default: 'pending' },

  transactionId: { type: String, required: true },
  qrCode: { type: String },
  Nights: { type: Number, default:1},
  platformFee: { type: Number, default: 4 },
  adminFeePercentage: { type: Number, default: 4 },
  isCheckedIn: { type: Boolean, default: false },
  bookedAt: { type: Date, default: Date.now },
}, { timestamps: true });

propertyBookingSchema.virtual('stayDuration').get(function () {
  if (this.checkIn && this.checkOut) {
    const diff = this.checkOut.getTime() - this.checkIn.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
  return 0;
});

const PropertyBooking = mongoose.model('PropertyBooking', propertyBookingSchema);
module.exports = PropertyBooking;
