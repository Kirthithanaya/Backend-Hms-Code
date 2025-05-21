import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  residentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resident",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  method: {
    type: String,
    enum: ['Stripe', 'PayPal', 'Cash'],
    required: true,
  },
});

export default mongoose.model("Payment", paymentSchema);
