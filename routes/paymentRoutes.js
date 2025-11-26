import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Payment from "../models/Payment.js";

dotenv.config();
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create Order
router.post("/order", async (req, res) => {
  try {
    const { amount, currency, userId } = req.body;

    const options = {
      amount: amount * 100,
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // MongoDB में save करें
    const payment = new Payment({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      user: userId || null,
      status: "created",
    });

    await payment.save();

    res.json(order);
  } catch (err) {
    console.error("Order error:", err);
    res.status(500).json({ error: "Error creating Razorpay order" });
  }
});

// ✅ Verify Payment
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest("hex");

    const payment = await Payment.findOne({ orderId: razorpay_order_id });

    if (!payment) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (razorpay_signature === expectedSign) {
      payment.paymentId = razorpay_payment_id;
      payment.signature = razorpay_signature;
      payment.status = "paid";
      await payment.save();

      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      payment.status = "failed";
      await payment.save();

      res.json({ success: false, message: "Payment verification failed" });
    }
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ error: "Error verifying Razorpay payment" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const payments = await Payment.find().populate("user", "firstName lastName email");
    res.json(payments);
  } catch (error) {
    console.error("Fetch all orders error:", error);
    res.status(500).json({ message: "Error fetching payments" });
  }
});

export default router;
