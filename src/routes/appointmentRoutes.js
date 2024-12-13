const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const Guide = require("../models/Guide");
const verifyToken = require("../middlewares/verifyToken");
const verifyRole = require("../middlewares/verifyRole");
const sendAppointmentNotificationEmail = require("../services/guideEmailService");
const sendAppointmentEmail = require("../services/appointmentEmailService");

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

// Update appointment status
router.put(
  "/:appointmentId",
  verifyToken,
  verifyRole(["tour-guide"]),
  async (req, res) => {
    const { appointmentId } = req.params;
    const { status } = req.body;

    try {
      const appointment = await Appointment.findById(appointmentId);
      appointment.status = status;
      await appointment.save();
      // update the guide's appointments array
      const guide = await Guide.findById(appointment.guideId);
      const appointmentIndex = guide.appointments.findIndex(
        (appointment) => appointment.appointmentId === appointmentId
      );
      guide.appointments[appointmentIndex].status = status;
      await guide.save();

      // Send notification email to the user and guide
      await sendAppointmentEmail(appointment, status);

      res.status(200).send(guide);
    } catch (error) {
      console.log("Failed to update appointment status", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
);

// Delete appointment by id
router.delete(
  "/:appointmentId",
  verifyToken,
  verifyRole(["tour-guide"]),
  async (req, res) => {
    const { appointmentId } = req.params;

    try {
      const appointment = await Appointment.findByIdAndDelete(appointmentId);
      if (!appointment) {
        return res.status(200).send({ message: "Appointment not found" });
      }

      // Update the guide's appointments array
      const guide = await Guide.findById(appointment.guideId);
      const appointmentIndex = guide.appointments.findIndex(
        (appointment) => appointment.appointmentId === appointmentId
      );
      guide.appointments.splice(appointmentIndex, 1);
      await guide.save();

      res.status(200).send(guide);
    } catch (error) {
      console.log("Failed to delete appointment", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
);

module.exports = router;
