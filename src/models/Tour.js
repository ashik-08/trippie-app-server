const mongoose = require("mongoose");
const { Schema, model } = mongoose;

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

module.exports = model("Tour", tourSchema);
