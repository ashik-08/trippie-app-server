const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const bookingSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  paymentId: String,
  type: String, // "hotel"
  details: Schema.Types.Mixed,
  bookedBy: {
    type: String,
    ref: "User",
  },
  bookingDate: {
    type: Date,
    default: Date.now,
    set: (value) => (value instanceof Date ? value : new Date(value)),
    get: (value) => (value ? value.toISOString().split("T")[0] : null),
  },
});

bookingSchema.set("toJSON", { getters: true });
bookingSchema.set("toObject", { getters: true });

module.exports = model("Booking", bookingSchema);
