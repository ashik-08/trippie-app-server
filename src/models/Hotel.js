const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const hotelSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  hotelId: String,
  roomsId: [String],
  name: String,
  city: String,
  smallLocation: String,
  detailedLocation: String,
  starRating: Number,
  images: [String],
  facilities: [String],
  minRoomPrice: Number,
  maxRoomPrice: Number,
  aboutUs: String,
  policy: [String],
});

module.exports = model("Hotel", hotelSchema);
