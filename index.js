import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import Product from "./models/Product.js";  

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


mongoose
  .connect(process.env.MONGO_URI, { dbName: "jayshreekisan" })
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => console.log(" MongoDB Error:", err));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });


app.use("/uploads", express.static("uploads"));


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
    res.json({ success: true, message: " Product saved!", product });
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


app.get("/api/search", async (req, res) => {
  const query = req.query.q || "";
  try {
    const results = await Product.find({
      name: { $regex: query, $options: "i" }, 
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
