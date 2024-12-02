const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const guideSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  guideName: String,
  email: String,
  mobile: String,
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
});

module.exports = model("Guide", guideSchema);
