const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  email: String,
  name: String,
  mobile: String,
  password: String,
  photo: String,
  createdAt: {
    type: Date,
    default: Date.now,
    set: (value) => (value instanceof Date ? value : new Date(value)),
    get: (value) => (value ? value.toISOString().split("T")[0] : null),
  },
  lastSignInTime: {
    type: Date,
    default: Date.now,
    set: (value) => (value instanceof Date ? value : new Date(value)),
    get: (value) => (value ? value.toISOString().split("T")[0] : null),
  },
  role: {
    type: String,
    enum: ["user", "admin", "hotel-manager", "tour-guide", "tour-agent"],
    default: "user",
  },
  dashboard: {
    hotelBookings: [{ type: String, ref: "HotelBooking" }],
    paymentHistory: [{ type: String, ref: "Payment" }],
    summary: {
      totalBookings: { type: Number, default: 0 },
      completedStays: { type: Number, default: 0 },
      canceledBookings: { type: Number, default: 0 },
      totalPayments: { type: Number, default: 0 },
      totalDues: { type: Number, default: 0 },
    },
  },
});

userSchema.set("toJSON", { getters: true });
userSchema.set("toObject", { getters: true });

module.exports = model("User", userSchema);
