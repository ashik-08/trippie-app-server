const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  email: {
    type: String,
    unique: true,
    match: /.+\@.+\..+/,
  },
  name: {
    type: String,
  },
  mobile: {
    type: String,
  },
  password: {
    type: String,
  },
  photo: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastSignInTime: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: [
      "user",
      "admin",
      "hotel-manager",
      "bus-operator",
      "tour-guide",
      "tour-agent",
    ],
    default: "user",
  },
});

module.exports = model("User", userSchema);
