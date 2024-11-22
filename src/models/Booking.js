const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const bookingSchema = new Schema({
  paymentId: String,
  type: String, // "hotel", "transport"
  details: Schema.Types.Mixed,
  bookedBy: {
    type: String,
    ref: "User",
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Booking", bookingSchema);
