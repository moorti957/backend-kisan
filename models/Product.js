import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  type: String,
  commodity: String,
  quantity: String,
  state: String,
  district: String,
  quality: String,
  availableFrom: String,
  language: String,
  comments: String,
  isOrganic: Boolean,
  isProcessed: Boolean,
  isGraded: Boolean,
  isPacked: Boolean,
  isStoredAC: Boolean,
  image: String,
  name: String,
  email: String,
});

export default mongoose.model("Product", productSchema);
