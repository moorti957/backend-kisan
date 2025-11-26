import Comment from "../models/commentModel.js";

// 🟢 Add new comment (for a specific product)
export const addComment = async (req, res) => {
  try {
    const { productId, name, comment } = req.body;

    // Validation
    if (!productId || !name || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Save comment in database
    const newComment = await Comment.create({ productId, name, comment });

    res.status(201).json({
      success: true,
      message: "Comment saved successfully!",
      data: newComment,
    });
  } catch (error) {
    console.error("Error saving comment:", error);
    res.status(500).json({
      success: false,
      message: "Error saving comment",
      error: error.message,
    });
  }
};

// 🟡 Get all comments for a specific product
export const getCommentsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const comments = await Comment.find({ productId }).sort({ createdAt: -1 });
    res.json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching comments",
      error: error.message,
    });
  }
};

// 🟣 Get total comment count for a specific product
export const getCommentCount = async (req, res) => {
  try {
    const { productId } = req.params;
    const count = await Comment.countDocuments({ productId });
    res.json({ success: true, productId, count });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching comment count",
      error: error.message,
    });
  }
};
