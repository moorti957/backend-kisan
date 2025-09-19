import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// ========================
// Register User
// ========================
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, mobile, username, password, role } = req.body;

    // Check existing
    const existingUser = await User.findOne({ $or: [{ mobile }, { username }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      mobile,
      username,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    // Generate JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: newUser,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ========================
// Generate OTP
// ========================
export const generateOtp = async (req, res) => {
  try {
    const { mobile } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${mobile}`,
    });

    return res.json({ success: true, message: "OTP sent successfully ✅" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to send OTP", error: err.message });
  }
};

// ========================
// Verify OTP Login
// ========================
export const signInWithOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.otp !== otp || new Date() > user.otpExpiry) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ========================
// Sign In with Username + Password
// ========================
export const signInWithUsername = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
