const mongoose = require("mongoose");
require("dotenv").config();
// const hotels = require("../../hotels.json");
// const Hotel = require("../models/Hotel");

// const rooms = require("../../rooms.json");
// const Room = require("../models/Room");

const connectDB = async () => {
  const { DB_URI, DB_NAME } = process.env;

  if (!DB_URI || !DB_NAME) {
    console.error(
      "Database URI or name is not defined in the environment variables."
    );
    process.exit(1); // Exit if critical environment variables are missing
  }

  try {
    await mongoose.connect(DB_URI, { dbName: DB_NAME });
    console.log(`Connected to the database: ${DB_NAME}`);
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1); // Exit the process with failure
  }

  // const populateDB = async () => {
  //   try {
  //     await Hotel.deleteMany({});
  //     await Hotel.insertMany(hotels);
  //     console.log("Database populated with hotel data");
  //     await Room.deleteMany({});
  //     await Room.insertMany(rooms);
  //     console.log("Database populated with room data");
  //     mongoose.connection.close();
  //   } catch (error) {
  //     console.error("Error populating database:", error);
  //     mongoose.connection.close();
  //   }
  // };

  // populateDB();

  // Connection events
  mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to the database");
  });

  mongoose.connection.on("error", (err) => {
    console.error("Mongoose connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected from the database");
  });
};

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("Mongoose connection closed due to application termination");
  process.exit(0);
});

module.exports = connectDB;
