const express = require("express");
const router = express.Router();
const Guide = require("../models/Guide");
const Service = require("../models/Service");
const Subscription = require("../models/Subscription");
const verifyToken = require("../middlewares/verifyToken");
const verifyRole = require("../middlewares/verifyRole");

// Get all tour guides
router.get("/", async (req, res) => {
  const { search } = req.query;

  try {
    const activeSubscriptions = await Subscription.find({ status: "active" });
    const activeGuideIds = activeSubscriptions.map((sub) => sub.email);

    const query = {
      email: { $in: activeGuideIds },
    };

    if (search) {
      query.area = { $regex: search, $options: "i" };
    }
    const guides = await Guide.find(query);
    res.status(200).send(guides);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Get guide by id and services by guide id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const guide = await Guide.findById(id);
    if (!guide) {
      return res.status(200).send({ message: "Guide not found!" });
    }
    const services = await Service.find({ guideId: id });
    res.status(200).send({ guide, services });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Get guide by email
router.get(
  "/email/:email",
  verifyToken,
  verifyRole(["tour-guide"]),
  async (req, res) => {
    const { email } = req.params;

    try {
      const guide = await Guide.findOne({ email });
      if (!guide) {
        return res.status(200).send({ message: "Guide not found!" });
      }
      res.status(200).send(guide);
    } catch (error) {
      console.log("Failed to fetch guide", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
);

// Add new guide
router.post("/", verifyToken, verifyRole(["tour-guide"]), async (req, res) => {
  const guideData = req.body;

  try {
    const guide = new Guide(guideData);
    await guide.save();
    res.status(201).send(guide);
  } catch (error) {
    console.log("Failed to add guide", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Update guide
router.put(
  "/:id",
  verifyToken,
  verifyRole(["tour-guide"]),
  async (req, res) => {
    const { id } = req.params;
    const guideData = req.body;

    try {
      const guide = await Guide.findByIdAndUpdate(id, guideData, {
        new: true,
      });
      if (!guide) {
        return res.status(200).send({ message: "Guide not found!" });
      }
      const services = await Service.find({ guideId: id });

      if (services.length > 0) {
        services.forEach((service) => {
          service.guideName = guideData.guideName;
          service.save();
        });
      }

      res.status(200).send(guide);
    } catch (error) {
      console.log("Failed to update guide", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
);

module.exports = router;
