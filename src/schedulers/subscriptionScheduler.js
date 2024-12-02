const cron = require("node-cron");
const Subscription = require("../models/Subscription");

const subscriptionScheduler = () => {
  // Schedule a job to run every day at midnight
  cron.schedule("0 0 * * *", async () => {
    try {
      const now = new Date();
      const expiredSubscriptions = await Subscription.find({
        validityEnd: { $lt: now },
        status: "active",
      });

      for (const subscription of expiredSubscriptions) {
        subscription.status = "inactive";
        await subscription.save();
      }

      console.log("Expired subscriptions updated successfully at", now);
    } catch (error) {
      console.error("Failed to update expired subscriptions", error);
    }
  });
};

module.exports = subscriptionScheduler;
