import Product from "../models/Product.js";

// Create product
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      user: req.user._id, // 🔑 Save logged-in user ID
      type: req.body.type,
      commodity: req.body.commodity,
      quantity: req.body.quantity,
      state: req.body.state,
      district: req.body.district,
      quality: req.body.quality,
      availableFrom: req.body.availableFrom,
      language: req.body.language,
      comments: req.body.comments,
      isOrganic: req.body.isOrganic,
      isProcessed: req.body.isProcessed,
      isGraded: req.body.isGraded,
      isPacked: req.body.isPacked,
      isStoredAC: req.body.isStoredAC,
      image: req.body.image,
      name: req.body.name,
      email: req.body.email,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// Get my products
export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id });
    res.json({ success: true, products });
  } catch (error) {
    console.error("Fetch My Products Error:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
