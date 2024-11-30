const express = require("express");
const router = express.Router();
const Tour = require("../models/Tour");
const Agency = require("../models/Agency");
const verifyToken = require("../middlewares/verifyToken");
const verifyRole = require("../middlewares/verifyRole");
const moment = require("moment-timezone");

// Add a new tour
router.post("/", verifyToken, verifyRole(["tour-agent"]), async (req, res) => {
  const tourData = req.body;

  try {
    const newTour = new Tour(tourData);
    const result = await newTour.save();
    const agency = await Agency.findById(tourData.agencyId);
    agency.toursId.push(result._id);
    await agency.save();
    res.status(201).send(result);
  } catch (error) {
    return res
      .status(500)
      .send({ error: true, message: "Internal Server Error" });
  }
});

// Update an existing tour
router.put(
  "/:id",
  verifyToken,
  verifyRole(["tour-agent"]),
  async (req, res) => {
    const { id } = req.params;
    const tourData = req.body;

    try {
      const updatedTour = await Tour.findByIdAndUpdate(id, tourData, {
        new: true,
      });
      if (!updatedTour) {
        return res.status(200).send({ message: "Tour not found" });
      }
      res.status(200).send(updatedTour);
    } catch (error) {
      return res
        .status(500)
        .send({ error: true, message: "Internal Server Error" });
    }
  }
);

// Get a tour by ID
router.get("/:id", async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(200).send({ message: "Tour not found" });
    }

    // Convert dates to Bangladesh time zone
    tour.startDate = moment.tz(tour.startDate, "Asia/Dhaka").format();
    tour.endDate = moment.tz(tour.endDate, "Asia/Dhaka").format();
    res.status(200).send(tour);
  } catch (error) {
    return res
      .status(500)
      .send({ error: true, message: "Internal Server Error" });
  }
});

// Get all tours
router.get("/", async (req, res) => {
  const { search, sortOrder, selectedType } = req.query;

  try {
    let query = { tourStatus: "upcoming" };

    if (search) {
      query.destinations = { $regex: search, $options: "i" };
    }

    if (selectedType) {
      query.tourType = selectedType;
    }

    let tours = await Tour.find(query);

    if (sortOrder === "asc") {
      tours = tours.sort((a, b) => a.pricePerPerson - b.pricePerPerson);
    } else if (sortOrder === "desc") {
      tours = tours.sort((a, b) => b.pricePerPerson - a.pricePerPerson);
    }

    res.status(200).json(tours);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all tours by agent email
router.get("/", verifyToken, verifyRole(["tour-agent"]), async (req, res) => {
  const { email } = req.query;

  try {
    const tours = await Tour.find({ agent: email });
    if (!tours) {
      return res.status(200).send({ message: "No tours found" });
    }

    // Convert dates to Bangladesh time zone
    tours.forEach((tour) => {
      tour.startDate = moment.tz(tour.startDate, "Asia/Dhaka").format();
      tour.endDate = moment.tz(tour.endDate, "Asia/Dhaka").format();
    });
    res.status(200).send(tours);
  } catch (error) {
    return res
      .status(500)
      .send({ error: true, message: "Internal Server Error" });
  }
});

// Delete a tour
router.delete(
  "/:id",
  verifyToken,
  verifyRole(["tour-agent"]),
  async (req, res) => {
    const { id } = req.params;

    try {
      const deletedTour = await Tour.findByIdAndDelete(id);
      if (!deletedTour) {
        return res.status(200).send({ message: "Tour not found" });
      }
      const agency = await Agency.findOne({ toursId: id });
      agency.toursId = agency.toursId.filter((tourId) => tourId !== id);
      await agency.save();
      res.status(200).send(deletedTour);
    } catch (error) {
      res.status(500).send({ error: true, message: "Internal Server Error" });
    }
  }
);

// Update tour status
router.put(
  "/status/:id",
  verifyToken,
  verifyRole(["tour-agent"]),
  async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const updatedTour = await Tour.findByIdAndUpdate(
        id,
        { tourStatus: status },
        {
          new: true,
        }
      );
      if (!updatedTour) {
        return res.status(200).send({ message: "Tour not found" });
      }
      res.status(200).send(updatedTour);
    } catch (error) {
      res.status(500).send({ error: true, message: "Internal Server Error" });
    }
  }
);

module.exports = router;
