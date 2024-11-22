const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const paymentSchema = new Schema({
  paymentId: String,
  amount: Number,
  currency: String,
  status: String, // succeeded, failed, pending
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  paidBy: {
    type: String,
    ref: "User",
  },
});

module.exports = model("Payment", paymentSchema);
