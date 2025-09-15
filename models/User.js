import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  mobile: { type: String, unique: true },
  username: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
  otp: String,
  otpExpiry: Date,
});

export default mongoose.model("User", userSchema);