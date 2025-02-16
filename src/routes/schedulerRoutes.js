const express = require("express");
const router = express.Router();
const subscriptionScheduler = require("../schedulers/subscriptionScheduler");

router.get("/trigger-scheduler", async (req, res) => {
  try {
    await subscriptionScheduler();
    res.status(200).send({ message: "Scheduler triggered successfully" });
  } catch (error) {
    console.error("Failed to trigger scheduler", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
