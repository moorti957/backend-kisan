import express from "express";
import {
  addComment,
  getCommentsByProduct,
  getCommentCount,
} from "../controllers/commentController.js";

const router = express.Router();

router.post("/", addComment); // Add new comment
router.get("/:productId", getCommentsByProduct); // Get comments for a product
router.get("/count/:productId", getCommentCount); // Get comment count

export default router;
