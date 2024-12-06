const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const guideSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  serviceIds: [String],
  guideName: String,
  email: String,
  mobile: String,
  nid: String,
  area: [String],
  languages: [String],
  expertise: [String],
  tourSizeLimitations: Number,
  paymentMethods: [String],
  bio: String,
  description: String,
  experience: String,
  pricing: String,
  profileImage: String,
  subscriptionStartDate: Date,
  subscriptionEndDate: Date,
  subscriptionStatus: String,
  appointments: [
    {
      appointmentId: String,
      bookingDate: {
        type: Date,
        default: Date.now,
      },
      bookedBy: String,
      startDate: Date,
      endDate: Date,
      slot: String,
      duration: String,
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },
      guestDetails: {
        name: String,
        email: String,
        mobile: String,
        partySize: Number,
      },
    },
  ],
});

module.exports = model("Guide", guideSchema);
