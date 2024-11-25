const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const paymentSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  paymentId: String,
  type: String, // "hotel"
  amount: Number,
  currency: String,
  status: String, // succeeded, failed, pending
  paymentDate: {
    type: Date,
    default: Date.now,
    set: (value) => (value instanceof Date ? value : new Date(value)),
    get: (value) => (value ? value.toISOString().split("T")[0] : null),
  },
  paidBy: {
    type: String,
    ref: "User",
  },
});

paymentSchema.set("toJSON", { getters: true });
paymentSchema.set("toObject", { getters: true });

module.exports = model("Payment", paymentSchema);
