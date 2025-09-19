// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    mobile: { type: String, unique: true }, // phone number
    username: { type: String, unique: true },
    password: String,
    role: { type: String, default: "user" },
    otp: String,
    otpExpiry: Date,
  },
  { timestamps: true } // ✅ this will auto-create createdAt & updatedAt
);

export default mongoose.model("User", userSchema);
