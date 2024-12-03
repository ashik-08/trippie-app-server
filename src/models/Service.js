const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const serviceSchema = new Schema({
  tourName: String,
  tourType: String,
  location: String,
  guestType: String,
  tourOverview: String,
  difficulty: [String],
  price: Number,
  idealTime: String,
  tourHighlights: [String],
  specialAspects: String,
  availabilityStartDate: Date,
  availabilityEndDate: Date,
  slot: {
    type: String,
    enum: ["morning", "afternoon", "night", "full day"],
  },
  duration: String,
  images: [String],
  guideId: String,
  guideName: String,
  guideEmail: {
    type: String, //email
    ref: "User",
  },
});

module.exports = model("Service", serviceSchema);
