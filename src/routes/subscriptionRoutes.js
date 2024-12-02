const express = require("express");
const router = express.Router();
const Subscription = require("../models/Subscription");
const verifyToken = require("../middlewares/verifyToken");
const verifyRole = require("../middlewares/verifyRole");

// Get subscription status
router.get(
  "/status",
  verifyToken,
  verifyRole(["tour-guide"]),
  async (req, res) => {
    const { email } = req.query;

    try {
      const subscription = await Subscription.findOne({ email, status: "active" });
      if (!subscription) {
        return res.status(200).send({ message: "No subscription found!" });
      }

      res.status(200).send(subscription);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
);

module.exports = router;
