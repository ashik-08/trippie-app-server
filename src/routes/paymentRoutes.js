const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");
const Room = require("../models/Room");
const Tour = require("../models/Tour");
const Subscription = require("../models/Subscription");
const verifyToken = require("../middlewares/verifyToken");
const { sendHotelBookingEmails } = require("../services/hotelEmailService");
const { sendTourBookingEmails } = require("../services/tourEmailService");
const {
  sendSubscriptionEmail,
} = require("../services/subscriptionEmailService");

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

    // Handle subscription logic
    if (type === "subscribe" || type === "renew") {
      const validityStart = new Date(Date.now());
      let validityEnd = new Date(validityStart);
      validityEnd.setMonth(validityEnd.getMonth() + 1);
      validityEnd.setHours(23, 59, 0, 0);

      let subscription;
      if (type === "subscribe") {
        subscription = new Subscription({
          email: userEmail,
          validityStart,
          validityEnd,
          status: "active",
        });
      } else if (type === "renew") {
        subscription = await Subscription.findOne({ email: userEmail });
        if (!subscription) {
          return res.status(200).send({ message: "No subscription found!" });
        }

        const remainingDays = Math.max(
          0,
          Math.ceil(
            (subscription.validityEnd - new Date()) / (1000 * 60 * 60 * 24)
          )
        );
        validityEnd.setDate(validityEnd.getDate() + remainingDays);
        subscription.validityStart = validityStart;
        subscription.validityEnd = validityEnd;
        subscription.status = "active";
      }

      await subscription.save();
      sendSubscriptionEmail(userEmail, validityStart, validityEnd, type);

      return res
        .status(200)
        .send({ message: "Payment confirmed and subscription updated" });
    }

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

    // update tour bookings if the booking is for a tour
    if (type === "tour") {
      const {
        tourId,
        totalParticipant,
        participantData,
        totalPrice,
        bookingAmount,
        dueAmount,
      } = details;
      const tour = await Tour.findById(tourId);

      // Update tour bookings array and bookedCount
      tour.tourBookings.push({
        participantData,
        totalParticipant,
        bookedBy: userEmail,
        totalAmount: totalPrice,
        bookingAmount,
        dueAmount,
        paymentId,
      });
      tour.bookedCount += totalParticipant;
      await tour.save();

      // Send tour booking confirmation email to agency and participant email addresses
      const bookingDetails = {
        tourName: tour.tourName,
        type: tour.tourType,
        destinations: tour.destinations,
        startDate: tour.startDate,
        endDate: tour.endDate,
        meetingPoint: tour.meetingPoint,
        contactInfo: tour.contactInfo,
        totalParticipant,
        participantData,
        agencyName: tour.agencyName,
        agencyEmail: tour.agencyEmail,
        agencyMobile: tour.agencyMobile,
        agent: tour.agent,
        paymentId,
        totalPrice,
        bookingAmount,
        dueAmount,
        userEmail,
      };

      sendTourBookingEmails(bookingDetails);
    }

    res.status(200).send({ message: "Booking saved successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
});

module.exports = router;
