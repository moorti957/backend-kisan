import express from "express";
import {
  createProduct,
  getMyProducts
} from "../controllers/productController.js";
import protect from "../Middleware/authMiddleware.js";
import upload from "../Middleware/upload.js";
import Product from "../models/Product.js";  // 👈 Import missing tha

const router = express.Router();

// ✅ Create Product (with image upload + auth)
router.post("/", protect, upload.single("image"), createProduct);

// ✅ Get logged-in user's products
router.get("/my", protect, getMyProducts);

// ✅ Get Single Product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
