const express = require("express");
const router = express.Router();
const Hotel = require("../models/Hotel");
const Room = require("../models/Room");
const verifyToken = require("../middlewares/verifyToken");
const verifyRole = require("../middlewares/verifyRole");

// Get room details by room id
router.get(
  "/:id",
  verifyToken,
  verifyRole(["hotel-manager"]),
  async (req, res) => {
    const { id } = req.params;

    try {
      const room = await Room.findById(id);
      return res.status(200).send(room);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ error: true, message: "Internal Server Error" });
    }
  }
);

// Add a new room type of a hotel
router.post(
  "/",
  verifyToken,
  verifyRole(["hotel-manager"]),
  async (req, res) => {
    const roomData = req.body;

    try {
      const result = await Room.create(roomData);
      const hotel = await Hotel.findById(roomData.hotelId);
      hotel.roomsId.push(result._id);
      await hotel.save();
      return res.status(201).send(result);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ error: true, message: "Internal Server Error" });
    }
  }
);

// Update an existing room type of a hotel
router.put(
  "/:id",
  verifyToken,
  verifyRole(["hotel-manager"]),
  async (req, res) => {
    const { id } = req.params;
    const roomData = req.body;

    try {
      const room = await Room.findByIdAndUpdate(id, roomData);
      return res.status(200).send(room);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ error: true, message: "Internal Server Error" });
    }
  }
);

// Get all rooms added by the hotel manager email
router.get(
  "/",
  verifyToken,
  verifyRole(["hotel-manager"]),
  async (req, res) => {
    const { email } = req.query;

    try {
      const rooms = await Room.find({ hotelManager: email });
      return res.status(200).send(rooms);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ error: true, message: "Internal Server Error" });
    }
  }
);

// Delete a specific room number
router.delete(
  "/:roomId/:roomNumber",
  verifyToken,
  verifyRole(["hotel-manager"]),
  async (req, res) => {
    const { roomId, roomNumber } = req.params;

    try {
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).send({ error: true, message: "Room not found" });
      }
      room.roomDetails = room.roomDetails.filter(
        (detail) => detail.roomNumber !== Number(roomNumber)
      );
      await room.save();
      return res.status(200).send(room);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ error: true, message: "Internal Server Error" });
    }
  }
);

// Delete an entire room type
router.delete(
  "/:id",
  verifyToken,
  verifyRole(["hotel-manager"]),
  async (req, res) => {
    const { id } = req.params;

    try {
      const room = await Room.findByIdAndDelete(id);
      const hotel = await Hotel.findById(room.hotelId);
      hotel.roomsId = hotel.roomsId.filter((roomId) => roomId !== id);
      await hotel.save();
      return res.status(200).send(room);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ error: true, message: "Internal Server Error" });
    }
  }
);

module.exports = router;
