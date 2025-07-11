const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Otp = require("../models/Otp");
const bcrypt = require("bcrypt");
const transporter = require("../config/nodemailer");

require("dotenv").config();

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

exports.sendOtp = async (req, res) => {
  const { email, username } = req.body;
  

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email or Username already exists" });
    }

    const otp = generateOtp();
    await Otp.deleteMany({ email });
    await Otp.create({ email, otp });

    await transporter.sendMail({
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    });

    res.json({ message: "OTP Sent Successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Error sending OTP" });
  }
};

exports.verifyOtp = async (req, res) => {
  const { username, email, password, otp } = req.body;

  try {
    const otpDoc = await Otp.findOne({ email, otp });

    if (!otpDoc) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const otpAge = (new Date() - otpDoc.createdAt) / 1000 / 60;
    if (otpAge > 5) {
      return res.status(400).json({ error: "Expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    await Otp.deleteOne({ email });

    console.log("User created successfully:", newUser);

    res.status(201).json({ message: "Signup Successful" });

  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Error verifying OTP" });
  }
};

exports.userlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.password) {
      return res.status(400).json({ error: "Password not set for this user" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "The password is incorrect" });
    }
  
    const token = jwt.sign(
      { 
        email: user.email, 
        userId: user._id,
        role: user.role || 'User'
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain: process.env.NODE_ENV === "production" ? ".jaisal.blog" : undefined,
      maxAge: 30 * 24 * 60 * 60 * 1000, 
      path: "/",
    });

    
    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        username: user.username,
        country: user.country,
        street: user.street,
        city: user.city,
        gender: user.gender,
        role: user.role || 'User',
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.updateprofile = async (req, res) => {
  const { firstName, lastName, username, country, city } = req.body;

  if (!firstName || !country || !city) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.username = username || user.username;
    user.country = country || user.country;
    user.city = city || user.city;

    user.profileSetup = true;

    await user.save();

    res.json({ message: "Profile updated successfullyy", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).send("USER NOT FOUND");

    return res.status(200).json({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      username: user.username,
      country: user.country,
      city: user.city,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server Error");
  }
};

exports.logout = async (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 1, secure: true, sameSite: "None" });

    return res.status(200).send("Logout Succesfull");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server Error");
  }
};
