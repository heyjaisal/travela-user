const mongoose = require("mongoose");

const hostSchema = new mongoose.Schema(
  {
    username: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, default: "host" },
    country: { type: String },
    googleId: { type: String },
    street: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    image: { type: String, default: null },
    profileSetup: { type: Boolean, default: false },
    city: { type: String },
    phone: { type: Number },
    gender: { type: String, enum: ["male", "female"] },
    stripeAccountId: { type: String, required: true }, 
  },
  { timestamps: true }
);

const Host = mongoose.model("Host", hostSchema);
module.exports = Host;
