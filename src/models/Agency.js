const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const agencySchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  toursId: [String],
  agencyName: String,
  ownerName: String,
  email: String,
  mobile: String,
  address: String,
  city: String,
  licenseNumber: String,
  description: String,
  website: String,
  socialMedia: [
    {
      platform: String,
      url: String,
      _id: false, // Disable automatic _id field
    },
  ],
  logo: String,
  agent: {
    type: String, //email
    ref: "User",
  },
});

module.exports = model("agency", agencySchema);
