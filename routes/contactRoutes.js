import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

// POST /api/contact
router.post("/", async (req, res) => {
  try {
    const { name, email, enquiry } = req.body;

    // simple validation
    if (!name || !email || !enquiry) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const contact = new Contact({ name, email, enquiry });
    await contact.save();

    res.status(201).json({ message: "Contact saved successfully", contact });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
