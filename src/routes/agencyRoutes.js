const express = require("express");
const router = express.Router();
const Agency = require("../models/Agency");
const Tour = require("../models/Tour");
const verifyToken = require("../middlewares/verifyToken");
const verifyRole = require("../middlewares/verifyRole");

// Add a new tour agency
router.post("/", verifyToken, verifyRole(["tour-agent"]), async (req, res) => {
  const agencyData = req.body;

  try {
    const newAgency = new Agency(agencyData);
    const result = await newAgency.save();
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
      const updatedAgency = await Agency.findByIdAndUpdate(id, agencyData, {
        new: true,
      });
      if (!updatedAgency) {
        return res.status(200).send({ message: "Tour agency not found" });
      }

      const tours = await Tour.find({ agencyId: id });
      if (tours.length > 0) {
        tours.forEach((tour) => {
          tour.agencyName = agencyData.name;
          tour.agencyEmail = agencyData.email;
          tour.agencyMobile = agencyData.mobile;
          tour.save();
        });
      }
      res.status(200).send(updatedAgency);
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

    try {
      const agency = await Agency.findOne({ agent: email });
      if (!agency) {
        return res.status(200).send({ message: "Tour agency not found" });
      }

      res.status(200).send(agency);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ error: true, message: "Internal Server Error" });
    }
  }
);

module.exports = router;
