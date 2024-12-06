const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const Guide = require("../models/Guide");
const sendAppointmentNotificationEmail = require("../services/guideEmailService");

// Create a new appointment
router.post("/", async (req, res) => {
  const appointmentData = req.body;

  try {
    const appointment = new Appointment(appointmentData);
    await appointment.save();

    // Update the guide's appointments
    const guide = await Guide.findById(appointmentData.guideId);
    guide.appointments.push({
      appointmentId: appointment._id,
      bookedBy: appointmentData.bookedBy,
      startDate: appointmentData.startDate,
      endDate: appointmentData.endDate,
      slot: appointmentData.slot,
      duration: appointmentData.duration,
      guestDetails: {
        ...appointmentData.guestDetails,
      },
    });
    await guide.save();

    // Send notification email to the guide
    await sendAppointmentNotificationEmail(guide.email, guide.guideName, {
      _id: appointment._id,
      bookedBy: appointmentData.bookedBy,
      startDate: appointmentData.startDate,
      endDate: appointmentData.endDate,
      slot: appointmentData.slot,
      duration: appointmentData.duration,
      guestDetails: appointmentData.guestDetails,
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error("Failed to create appointment", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
