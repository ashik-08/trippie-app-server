const Subscription = require("../models/Subscription");
const Guide = require("../models/Guide");

const subscriptionScheduler = async () => {
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

    const expiredProfile = await Guide.find({
      subscriptionEndDate: { $lt: now },
      subscriptionStatus: "active",
    });

    for (const guide of expiredProfile) {
      guide.subscriptionStatus = "inactive";
      await guide.save();
    }

    console.log("Expired subscriptions updated successfully at", now);
  } catch (error) {
    console.error("Failed to update expired subscriptions", error);
  }
};

module.exports = subscriptionScheduler;
