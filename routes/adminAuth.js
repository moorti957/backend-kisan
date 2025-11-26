// backend/routes/adminAuth.js
import express from "express";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "12345") {
    const token = jwt.sign({ username }, "secretKey", { expiresIn: "1h" });
    return res.json({ token });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

export default router;
