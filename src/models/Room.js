const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const roomDetailSchema = new Schema({
  _id: false, // Disable automatic _id field
  roomNumber: Number,
  addedDate: {
    type: Date,
    set: (value) => (value instanceof Date ? value : new Date(value)),
    get: (value) => (value ? value.toISOString().split("T")[0] : null),
  },
  availabilityDate: {
    type: Date,
    set: (value) => (value instanceof Date ? value : new Date(value)),
    get: (value) => (value ? value.toISOString().split("T")[0] : null),
  },
  bookings: [
    {
      startDate: {
        type: Date,
        set: (value) => (value instanceof Date ? value : new Date(value)),
        get: (value) => (value ? value.toISOString().split("T")[0] : null),
      },
      endDate: {
        type: Date,
        set: (value) => (value instanceof Date ? value : new Date(value)),
        get: (value) => (value ? value.toISOString().split("T")[0] : null),
      },
      bookingDate: {
        type: Date,
        set: (value) => (value instanceof Date ? value : new Date(value)),
        get: (value) => (value ? value.toISOString().split("T")[0] : null),
      },
      guestDetails: {
        name: String,
        email: String,
        phone: String,
      },
      bookedBy: { type: String, ref: "User" },
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
  hotelId: String,
  hotelName: String,
  hotelManager: String,
  name: String,
  type: String,
  bedType: String,
  maxGuests: Number,
  facilities: [String],
  pricePerNight: Number,
  images: [String],
  roomDetails: [roomDetailSchema],
});

roomDetailSchema.set("toJSON", { getters: true });
roomDetailSchema.set("toObject", { getters: true });

module.exports = model("Room", roomSchema);
