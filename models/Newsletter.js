import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String }, // optional → if you also want to save name
  },
  { timestamps: true }
);

export default mongoose.model("Newsletter", newsletterSchema);
