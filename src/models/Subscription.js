const mongoose = require("mongoose");
const { Schema, model } = mongoose;
// const moment = require("moment-timezone");

const subscriptionSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  email: String,
  validityStart: {
    type: Date,
    default: Date.now,
    set: (value) => (value instanceof Date ? value : new Date(value)),
  },
  validityEnd: {
    type: Date,
    set: (value) => (value instanceof Date ? value : new Date(value)),
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },
});

module.exports = model("Subscription", subscriptionSchema);
