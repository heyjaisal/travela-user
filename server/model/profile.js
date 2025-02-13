const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username:{type:String},
    email: { type: String, required: true, unique: true },
    password: { type: String  },
    role: { type: String, default: "user" },
    country: { type: String },
    googleId: { type: String },
    street: { type: String },
    firstName: { type: String },
    lastName:{type:String},
    image: { type: String, required: false ,default:null},
    profileSetup: { type: Boolean,default: false},
    city: { type: String },
    gender: { type: String, enum: ["male", "female"] },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
