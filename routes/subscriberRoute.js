import express from 'express';
import Subscriber from '../models/subscribeModel.js';

const router = express.Router();

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

export default router;
