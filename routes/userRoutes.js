// routes/userRoutes.js
import express from "express";
import User from "../models/User.js";

const router = express.Router();

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;
