const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const roomDetailSchema = new Schema({
  roomNumber: Number,
  addedDate: Date,
  availabilityDate: Date,
  bookings: [
    {
      startDate: Date,
      endDate: Date,
      guestDetails: {
        name: String,
        email: String,
        phone: Number,
      },
      bookedBy: { type: String, ref: "User" },
      bookingDate: Date,
      totalAmount: Number,
      bookingAmount: Number,
      dueAmount: Number,
      paymentId: String,
    },
  ],
});

const roomSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  roomId: String,
  hotelId: String,
  name: String,
  type: String,
  bedType: String,
  maxGuests: Number,
  facilities: [String],
  pricePerNight: Number,
  images: [String],
  roomDetails: [roomDetailSchema],
});

module.exports = model("Room", roomSchema);
