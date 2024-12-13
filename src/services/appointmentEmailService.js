const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const generateEmailContent = (
  recipientName,
  appointmentDetails,
  isGuide = false
) => {
  const {
    guideName,
    guideEmail,
    guideMobile,
    guestDetails,
    startDate,
    endDate,
    slot,
    duration,
    status,
  } = appointmentDetails;
  const subject =
    status === "accepted"
      ? "Your Appointment is Confirmed"
      : "Your Appointment is Rejected";
  const statusMessage = status === "accepted" ? "confirmed" : "rejected";

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
          font-size: 24px;
        }
        .email-content {
          padding: 20px;
        }
        .email-content h2 {
          color: #333333;
          border-bottom: 2px solid #f4f4f4;
          padding-bottom: 5px;
        }
        .email-content p {
          margin: 10px 0;
        }
        .email-footer {
          text-align: center;
          margin-top: 20px;
          color: #888888;
          font-size: 12px;
        }
        .highlight {
          font-weight: bold;
          color: #007bff;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          margin-top: 20px;
          background: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        }
        .button:hover {
          background: #0056b3;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>${subject}</h1>
        </div>
        <div class="email-content">
          <p>Dear <span class="highlight">${recipientName}</span>,</p>
          ${
            isGuide
              ? `
            <p>You have ${statusMessage} an appointment with <span class="highlight">${guestDetails.name}</span>.</p>
          `
              : `
            <p>Your appointment with <span class="highlight">${guideName}</span> has been ${statusMessage}.</p>
          `
          }
          <h2>Appointment Details</h2>
          ${
            isGuide
              ? `
            <p><strong>Guest Name:</strong> ${guestDetails.name}</p>
            <p><strong>Guest Email:</strong> ${guestDetails.email}</p>
            <p><strong>Guest Mobile:</strong> ${guestDetails.mobile}</p>
            <p><strong>Party Size:</strong> ${guestDetails.partySize}</p>
          `
              : `
            <p><strong>Guide Name:</strong> ${guideName}</p>
            <p><strong>Guide Email:</strong> ${guideEmail}</p>
            <p><strong>Guide Mobile:</strong> ${guideMobile}</p>
          `
          }
          <p><strong>Start Date:</strong> ${new Date(
            startDate
          ).toLocaleDateString()}</p>
          <p><strong>End Date:</strong> ${new Date(
            endDate
          ).toLocaleDateString()}</p>
          <p><strong>Slot:</strong> ${slot}</p>
          <p><strong>Duration:</strong> For ${duration}</p>
          ${!isGuide ? '<a href="#" class="button">View Your Booking</a>' : ""}
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

const sendAppointmentEmail = async (appointment, status) => {
  const { name, email } = appointment.guestDetails;
  const guideEmail = appointment.guideEmail;
  const guideName = appointment.guideName;
  const subject =
    status === "accepted"
      ? "Your Appointment is Confirmed"
      : "Your Appointment is Rejected";

  const guestEmailContent = generateEmailContent(name, appointment);
  const guideEmailContent = generateEmailContent(guideName, appointment, true);

  const msgToGuest = {
    to: email,
    from: process.env.SENDGRID_SENDER_EMAIL,
    subject,
    html: guestEmailContent,
  };

  const msgToGuide = {
    to: guideEmail,
    from: process.env.SENDGRID_SENDER_EMAIL,
    subject,
    html: guideEmailContent,
  };

  try {
    await sgMail.send(msgToGuest);
    await sgMail.send(msgToGuide);
    console.log("Appointment confirmation emails sent successfully");
  } catch (error) {
    console.error("Failed to send emails", error);
  }
};

module.exports = sendAppointmentEmail;
