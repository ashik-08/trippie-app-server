const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const moment = require("moment-timezone");

const transportSchema = new Schema({
  transportType: String, // Flight, Bus, Train, etc.
  pickUpLocation: String,
  dropOffLocation: String,
  pickUpTime: Date,
  dropOffTime: Date,
});

const itinerarySchema = new Schema({
  day: Number,
  activities: String,
  meals: [String],
  accommodation: String,
  transport: transportSchema,
});

const tourSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  tourName: String,
  tourType: String,
  destinations: [String],
  shortDescription: String,
  startDate: Date,
  endDate: Date,
  duration: String,
  maxGroupSize: Number,
  minAge: Number,
  pricePerPerson: Number,
  inclusions: String,
  exclusions: String,
  itinerary: [itinerarySchema],
  images: [String],
  tourHighlights: String,
  importantNotes: String,
  meetingPoint: String,
  contactInfo: String,
  agencyName: String,
  agencyId: {
    type: String,
    ref: "Agency",
  },
  agencyEmail: String,
  agencyMobile: String,
  agent: {
    type: String, //email
    ref: "User",
  },
  tourStatus: {
    type: String,
    default: "upcoming", // upcoming, ongoing, completed
  },
  tourBookings: [String],
  bookedCount: {
    type: Number,
    default: 0,
  },
});

// Method to update tour status
tourSchema.methods.updateTourStatus = function () {
  const now = moment.tz("Asia/Dhaka").toDate();
  if (this.startDate <= now && this.endDate >= now) {
    this.tourStatus = "ongoing";
  } else if (this.endDate < now) {
    this.tourStatus = "completed";
  } else {
    this.tourStatus = "upcoming";
  }
};

// Middleware to update tour status after each find or findOne query
tourSchema.post("find", function (docs) {
  docs.forEach((doc) => doc.updateTourStatus());
});

tourSchema.post("findOne", function (doc) {
  if (doc) {
    doc.updateTourStatus();
  }
});

module.exports = model("Tour", tourSchema);