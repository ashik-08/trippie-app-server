const express = require("express");
const router = express.Router();
const TourAgency = require("../models/TourAgency");
const verifyToken = require("../middlewares/verifyToken");
const verifyRole = require("../middlewares/verifyRole");

// Add a new tour agency
router.post("/", verifyToken, verifyRole(["tour-agent"]), async (req, res) => {
  const agencyData = req.body;

  try {
    const newTourAgency = new TourAgency(agencyData);
    const result = await newTourAgency.save();
    res.status(201).send(result);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: true, message: "Internal Server Error" });
  }
});

// Update an existing tour agency
router.put(
  "/:id",
  verifyToken,
  verifyRole(["tour-agent"]),
  async (req, res) => {
    const { id } = req.params;
    const agencyData = req.body;

    try {
      const updatedTourAgency = await TourAgency.findByIdAndUpdate(
        id,
        agencyData,
        { new: true }
      );
      if (!updatedTourAgency) {
        return res.status(200).send({ message: "Tour agency not found" });
      }
      res.status(200).send(updatedTourAgency);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ error: true, message: "Internal Server Error" });
    }
  }
);

// Get a tour agency by manager email
router.get(
  "/:email",
  verifyToken,
  verifyRole(["tour-agent"]),
  async (req, res) => {
    const { email } = req.params;

    console.log(email);

    try {
      const tourAgency = await TourAgency.findOne({ agent: email });
      if (!tourAgency) {
        return res.status(200).send({ message: "Tour agency not found" });
      }

      console.log(tourAgency);

      res.status(200).send(tourAgency);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ error: true, message: "Internal Server Error" });
    }
  }
);

module.exports = router;
