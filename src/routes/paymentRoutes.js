const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");
const Room = require("../models/Room");
const verifyToken = require("../middlewares/verifyToken");
const { sendHotelBookingEmails } = require("../services/hotelEmailService");

// Create a payment intent
router.post("/create-payment-intent", verifyToken, async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card"],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
});

// Save booking and payment data
router.post("/confirm-booking", verifyToken, async (req, res) => {
  const { userEmail, type, details, paymentId, amount, currency, status } =
    req.body;

  try {
    // Save payment data
    const payment = new Payment({
      paymentId,
      type,
      amount,
      currency,
      status,
      paidBy: userEmail,
    });
    await payment.save();

    // Save booking data
    const booking = new Booking({
      paymentId,
      type,
      details,
      bookedBy: userEmail,
    });
    await booking.save();

    // Update Room collection if the booking is for a hotel
    if (type === "hotel") {
      const {
        hotelId,
        selectedRooms,
        checkInDate,
        checkOutDate,
        guestData,
        totalPrice,
        bookingAmount,
        dueAmount,
      } = details;
      const roomNumbers = selectedRooms.map((room) => room.roomNumber);

      // Loop through each selected room to update its bookings
      for (const roomNumber of roomNumbers) {
        await Room.updateOne(
          { hotelId, "roomDetails.roomNumber": roomNumber },
          {
            $push: {
              "roomDetails.$.bookings": {
                startDate: checkInDate,
                endDate: checkOutDate,
                guestDetails: {
                  name: guestData.name,
                  email: guestData.email,
                  phone: guestData.phone,
                },
                bookedBy: userEmail,
                totalAmount: totalPrice,
                bookingAmount,
                dueAmount,
                paymentId,
              },
            },
          }
        );
      }

      const hotel = await Hotel.findById(hotelId);

      // Send hotel booking confirmation email
      const bookingDetails = {
        hotelName: hotel.name,
        location: hotel.location,
        guestData,
        checkInDate,
        checkOutDate,
        roomNumbers,
        paymentId,
        totalPrice,
        bookingAmount,
        dueAmount,
        userEmail,
        hotelManager: hotel.manager.split("@")[0],
        hotelManagerEmail: hotel.manager,
      };

      sendHotelBookingEmails(bookingDetails);
    }

    res.status(200).send({ message: "Booking saved successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
});

module.exports = router;
