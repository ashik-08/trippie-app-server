const express = require("express");
const router = express.Router();
const Hotel = require("../models/Hotel");
const Room = require("../models/Room");

// checks if a room is available for booking on the given dates
const isRoomAvailable = (roomDetail, checkIn, checkOut) => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const addedDate = new Date(roomDetail.addedDate);
  const availabilityDate = new Date(roomDetail.availabilityDate);

  if (checkInDate < addedDate || checkOutDate > availabilityDate) {
    return false;
  }

  for (const booking of roomDetail.bookings) {
    const bookingStartDate = new Date(booking.startDate);
    const bookingEndDate = new Date(booking.endDate);

    if (
      (checkInDate >= bookingStartDate && checkInDate < bookingEndDate) ||
      (checkOutDate > bookingStartDate && checkOutDate <= bookingEndDate) ||
      (checkInDate <= bookingStartDate && checkOutDate >= bookingEndDate) ||
      (checkInDate > bookingStartDate && checkOutDate < bookingEndDate)
    ) {
      return false;
    }
  }

  return true;
};

// Get all hotels
router.get("/", async (req, res) => {
  const {
    location,
    checkInDate,
    checkOutDate,
    rooms,
    starRating,
    minPrice,
    maxPrice,
  } = req.query;

  try {
    let hotels;
    const query = {};

    if (location) {
      query.city = new RegExp(location, "i");
    }

    if (starRating) {
      query.starRating = parseInt(starRating);
    }

    if (minPrice || maxPrice) {
      query.$and = [];
      if (minPrice) {
        query.$and.push({ minRoomPrice: { $gte: parseInt(minPrice) } });
      }
      if (maxPrice) {
        query.$and.push({ maxRoomPrice: { $lte: parseInt(maxPrice) } });
      }
    }

    hotels = await Hotel.find(query);

    if (hotels.length === 0) {
      return res.status(200).send([]);
    }

    if (location && checkInDate && checkOutDate) {
      const hotelIds = hotels.map((hotel) => hotel.hotelId);
      const availableHotels = [];

      for (const hotelId of hotelIds) {
        const hotelRooms = await Room.find({ hotelId });
        const hasAvailableRoom = hotelRooms.some((room) => {
          return room.roomDetails.some((roomDetail) =>
            isRoomAvailable(roomDetail, checkInDate, checkOutDate)
          );
        });

        if (hasAvailableRoom) {
          const hotel = hotels.find((hotel) => hotel.hotelId === hotelId);
          availableHotels.push(hotel);
        }
      }

      return res.status(200).send(availableHotels);
    } else {
      return res.status(200).send(hotels);
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: true, message: "Internal Server Error" });
  }
});

// Get hotel details and available rooms by hotelId
router.get("/details/:hotelId", async (req, res) => {
  const { hotelId } = req.params;
  const { checkInDate, checkOutDate } = req.query;

  try {
    const hotel = await Hotel.findOne({ hotelId });
    if (!hotel) {
      return res.status(200).send({ message: "Hotel not found" });
    }

    const rooms = await Room.find({ hotelId });
    const availableRooms = rooms
      .map((room) => {
        const availableRoomDetails = room.roomDetails.filter((roomDetail) =>
          isRoomAvailable(roomDetail, checkInDate, checkOutDate)
        );
        const availableRoomCount = availableRoomDetails.length;
        return {
          ...room._doc,
          roomDetails: availableRoomDetails,
          availableRoomCount,
        };
      })
      .filter((room) => room.roomDetails.length > 0);

    return res.status(200).send({ hotel, availableRooms });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: true, message: "Internal Server Error" });
  }
});

module.exports = router;
