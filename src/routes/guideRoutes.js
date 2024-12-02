const express = require("express");
const router = express.Router();
const Guide = require("../models/Guide");
const verifyToken = require("../middlewares/verifyToken");
const verifyRole = require("../middlewares/verifyRole");

// Get guide by email
router.get(
  "/:email",
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
      res.status(200).send(guide);
    } catch (error) {
      console.log("Failed to update guide", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
);

module.exports = router;
