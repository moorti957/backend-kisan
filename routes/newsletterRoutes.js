import express from "express";
import Newsletter from "../models/Newsletter.js";

const router = express.Router();

// ✅ Add Subscriber
router.post("/", async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.json({ success: true, message: "Already subscribed!" });
    }

    const newSub = new Newsletter({ email, name });
    await newSub.save();

    res.json({ success: true, message: "Subscribed successfully!" });
  } catch (err) {
    console.error("❌ Newsletter Subscribe Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ List Subscribers
router.get("/list", async (req, res) => {
  try {
    console.log("📩 GET /api/newsletter/list called");
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.json({ success: true, data: subscribers });
  } catch (err) {
    console.error("❌ Newsletter List Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
