const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    propertyType: { type: String, required: true,},
    title: { type: String, required: true, trim: true },
    size: { type: Number, required: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, trim: true },
    bedrooms: { type: Number, required: true, min: 1 },
    kitchen: { type: Number, required: true, min: 0},
    bathrooms: { type: Number, required: true, min: 0},
    maxGuests: { type: Number, required: true, min: 0 },
    maxStay: { type: Number, required: true, min: 0 },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    address: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    images: [{ type: String }],
    features: [{ text: { type: String, required: true, trim: true } }],
    saves: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    host: { type: mongoose.Schema.Types.ObjectId, ref: "Host", required: true },
    status: {
      type: String,
      enum: ["pending", "verified", "canceled"],
      default: "pending",
    },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);
module.exports = Property;
