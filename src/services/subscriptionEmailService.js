const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendSubscriptionEmail = async (
  email,
  validityStart,
  validityEnd,
  type
) => {
  const subject =
    type === "subscribed" ? "Subscription Activated" : "Subscription Renewed";
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f7fc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center;">
          <h2 style="color: #5c6bc0;">${
            type === "subscribed" ? "Welcome to the Family!" : "Welcome Back!"
          }</h2>
          <p style="font-size: 18px; color: #757575;">We are excited to have you on board.</p>
        </div>

        <div style="margin-top: 20px;">
          <p style="font-size: 16px; color: #555;">
            <strong>Dear User,</strong>
          </p>
          <p style="font-size: 16px; color: #555;">
            Your subscription has been ${type} successfully.
          </p>
          <p style="font-size: 16px; color: #555;">
            <strong>Subscription Validity:</strong> <span style="color: #5c6bc0;">${validityStart.toDateString()} to ${validityEnd.toDateString()}</span>
          </p>
        </div>

        <div style="margin-top: 20px; background-color: #f1f1f1; padding: 15px; border-radius: 8px; text-align: center;">
          <p style="font-size: 14px; color: #757575;">Thank you for choosing our service!</p>
          <p style="font-size: 14px; color: #757575;">If you have any questions, feel free to reach out.</p>
        </div>

        <div style="margin-top: 30px; text-align: center;">
          <a href="https://trippie-app-client.vercel.app/" style="background-color: #5c6bc0; color: white; padding: 10px 20px; font-size: 16px; border-radius: 5px; text-decoration: none;">
            Visit Our Website
          </a>
        </div>

        <!-- Footer Section -->
        <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #999; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p>&copy; 2024 Trippie. All rights reserved.</p>
          <p>Need help? <a href="mailto:trippie.info7@gmail.com" style="color: #5c6bc0; text-decoration: none;">Contact Support</a></p>
        </div>
      </div>
    </div>
  `;

  const msg = {
    to: email,
    from: process.env.SENDGRID_SENDER_EMAIL,
    subject,
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    console.log("Subscription email sent successfully");
  } catch (error) {
    console.error("Failed to send subscription email", error);
  }
};

module.exports = { sendSubscriptionEmail };
