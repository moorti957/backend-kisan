import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";
import Product from "./models/Product.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminAuth from "./routes/adminAuth.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI, { dbName: "jayshreekisan" })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// Ensure uploads folder exists
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Serve uploads folder
app.use("/uploads", express.static("uploads"));

// Product routes
app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    const productData = {
      ...req.body,
      isOrganic: req.body.isOrganic === "true",
      isProcessed: req.body.isProcessed === "true",
      isGraded: req.body.isGraded === "true",
      isPacked: req.body.isPacked === "true",
      isStoredAC: req.body.isStoredAC === "true",
      image: req.file ? req.file.filename : null,
    };

    const product = new Product(productData);
    await product.save();
    res.json({ success: true, message: "Product saved!", product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/products", productRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminAuth);
app.use("/api/admin", adminRoutes);


const __dirname = path.resolve();

// Paths to builds
const frontendPath = path.join(__dirname, "../Jay-Shree-Kishan/build");
const adminPath = path.join(__dirname, "../Kishan-admin/build");

// Serve admin build at /admin  
app.use("/admin", express.static(adminPath));
app.get(/^\/admin(\/.*)?$/, (req, res) => {
  res.sendFile(path.join(adminPath, "index.html"));
});

// Serve main frontend build at /
app.use(express.static(frontendPath));
app.get(/^\/(?!admin).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
