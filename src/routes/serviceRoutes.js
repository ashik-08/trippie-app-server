const express = require("express");
const router = express.Router();
const Guide = require("../models/Guide");
const Service = require("../models/Service");
const verifyToken = require("../middlewares/verifyToken");
const verifyRole = require("../middlewares/verifyRole");

// Get all services by email
router.get(
  "/email/:email",
  verifyToken,
  verifyRole(["tour-guide"]),
  async (req, res) => {
    const { email } = req.params;

    try {
      const services = await Service.find({ guideEmail: email });
      res.status(200).send(services);
    } catch (error) {
      console.error("Failed to fetch services!", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
);

// Get service by ID
router.get(
  "/:id",
  verifyToken,
  verifyRole(["tour-guide"]),
  async (req, res) => {
    const { id } = req.params;

    try {
      const service = await Service.findById(id);
      if (!service) {
        return res.status(200).send({ message: "Service not found!" });
      }
      res.status(200).send(service);
    } catch (error) {
      console.error("Failed to fetch service!", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
);

// Add new service
router.post("/", verifyToken, verifyRole(["tour-guide"]), async (req, res) => {
  const serviceData = req.body;

  try {
    const service = new Service(serviceData);
    await service.save();
    // Add service to guide serviceIds array
    const guide = await Guide.findById(service.guideId);
    guide.serviceIds.push(service._id);
    await guide.save();

    res.status(201).send(service);
  } catch (error) {
    console.error("Failed to add service!", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Update service
router.put(
  "/:id",
  verifyToken,
  verifyRole(["tour-guide"]),
  async (req, res) => {
    const { id } = req.params;
    const serviceData = req.body;

    try {
      const service = await Service.findByIdAndUpdate(id, serviceData, {
        new: true,
      });
      if (!service) {
        return res.status(200).send({ message: "Service not found!" });
      }
      res.status(200).send(service);
    } catch (error) {
      console.error("Failed to update service!", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
);

// Delete service
router.delete(
  "/:id",
  verifyToken,
  verifyRole(["tour-guide"]),
  async (req, res) => {
    const { id } = req.params;

    try {
      const service = await Service.findByIdAndDelete(id);
      if (!service) {
        return res.status(200).send({ message: "Service not found!" });
      }
      // Remove service from guide serviceIds array
      const guide = await Guide.findById(service.guideId);
      guide.serviceIds = guide.serviceIds.filter(
        (serviceId) => serviceId !== id
      );
      await guide.save();

      res.status(200).send(service);
    } catch (error) {
      console.error("Failed to delete service!", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
);

module.exports = router;
