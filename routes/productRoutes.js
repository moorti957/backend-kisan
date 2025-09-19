import express from "express";
import { createProduct, getMyProducts } from "../controllers/productController.js";
import protect from "../Middleware/authMiddleware.js";
import upload from "../Middleware/upload.js";

const router = express.Router();

// ✅ Create Product (with image upload + auth)
router.post("/", protect, upload.single("image"), createProduct);

// ✅ Get logged-in user's products
router.get("/my", protect, getMyProducts);

export default router;
