// routes/subscriberRoute.js
import express from 'express';
import Subscriber from '../models/subscribeModel.js';

const router = express.Router();

// ✅ POST: Add a subscriber
router.post('/login', async (req, res) => {
  const { name, email } = req.body;

  try {
    const newSubscriber = new Subscriber({ name, email });
    await newSubscriber.save();
    res.status(201).json({ message: "Subscription successful" });
  } catch (error) {
    console.error("Error saving subscriber:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ GET: Fetch all subscribers
router.get('/list', async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.status(200).json({ success: true, data: subscribers });
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
