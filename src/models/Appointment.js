const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const appointmentSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  guideId: {
    type: String,
    ref: "Guide",
  },
  guideName: String,
  guideEmail: String,
  guideMobile: String,
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  bookedBy: String,
  startDate: Date,
  endDate: Date,
  slot: {
    type: String,
    enum: ["morning", "afternoon", "night", "full day"],
  },
  duration: String,
  guestDetails: {
    name: String,
    email: String,
    mobile: String,
    partySize: Number,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});

module.exports = model("Appointment", appointmentSchema);
