const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const generateAppointmentEmailContent = (guideName, appointmentDetails) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .email-container {
          max-width: 600px;
          margin: 20px auto;
          background: #ffffff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .email-header {
          text-align: center;
          background: #007bff;
          color: white;
          padding: 15px;
          border-radius: 10px 10px 0 0;
        }
        .email-header h1 {
          margin: 0;
        }
        .email-body {
          padding: 20px;
        }
        .email-body h2 {
          color: #333;
        }
        .email-body p {
          margin: 10px 0;
        }
        .email-footer {
          text-align: center;
          padding: 10px;
          background: #f4f4f4;
          border-radius: 0 0 10px 10px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>New Appointment Booking</h1>
        </div>
        <div class="email-body">
          <h2>Dear ${guideName},</h2>
          <p>You have a new appointment booking.</p>
          <p><strong>Appointment ID:</strong> ${appointmentDetails._id}</p>
          <p><strong>Booked By:</strong> ${appointmentDetails.bookedBy}</p>
          <p><strong>Start Date:</strong> ${new Date(
            appointmentDetails.startDate
          ).toLocaleDateString()}</p>
          <p><strong>End Date:</strong> ${new Date(
            appointmentDetails.endDate
          ).toLocaleDateString()}</p>
          <p><strong>Slot:</strong> ${appointmentDetails.slot}</p>
          <p><strong>Duration:</strong> ${appointmentDetails.duration}</p>

          <h2>Guest Details</h2>
          <p><strong>Name:</strong> ${appointmentDetails.guestDetails.name}</p>
          <p><strong>Email:</strong> ${
            appointmentDetails.guestDetails.email
          }</p>
          <p><strong>Mobile:</strong> ${
            appointmentDetails.guestDetails.mobile
          }</p>
          <p><strong>Total People:</strong> ${
            appointmentDetails.guestDetails.partySize
          }</p>

          <p>Please check your dashboard for more details.</p>
        </div>
        <div class="email-footer">
          <p>&copy; 2024 Trippie. All rights reserved.</p>
          <p>Need help? <a href="mailto:trippie.info7@gmail.com">Contact Support</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const sendAppointmentNotificationEmail = async (
  to,
  guideName,
  appointmentDetails
) => {
  const msg = {
    to,
    from: process.env.SENDGRID_SENDER_EMAIL,
    subject: "New Appointment Booking",
    html: generateAppointmentEmailContent(guideName, appointmentDetails),
  };

  try {
    await sgMail.send(msg);
    console.log("Booking notification email sent successfully");
  } catch (error) {
    console.error("Error sending booking notification email", error);
  }
};

module.exports = sendAppointmentNotificationEmail;
