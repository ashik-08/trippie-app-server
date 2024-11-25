const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const hotelSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  roomsId: [String],
  name: String,
  city: String,
  area: String,
  location: String,
  starRating: Number,
  images: [String],
  facilities: [String],
  minRoomPrice: Number,
  maxRoomPrice: Number,
  aboutUs: String,
  policy: [String],
  manager: {
    type: String,
    ref: "User",
  },
});

module.exports = model("Hotel", hotelSchema);
