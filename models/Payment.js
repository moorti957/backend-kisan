import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    paymentId: { type: String },
    signature: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { type: String, default: "created" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
