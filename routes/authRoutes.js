import express from "express";
import { registerUser, generateOtp, signInWithOtp, signInWithUsername } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/generate-otp", generateOtp);
router.post("/signin-otp", signInWithOtp);
router.post("/signin-username", signInWithUsername);

export default router;