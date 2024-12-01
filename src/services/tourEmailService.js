const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const generateEmailContent = (
  recipientName,
  bookingDetails,
  isAgent = false
) => {
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
          <h1>${
            isAgent ? "New Booking Notification" : "Tour Booking Confirmation"
          }</h1>
        </div>
        <div class="email-content">
          <p>Dear <span class="highlight">${recipientName}</span>,</p>
          <p>${
            isAgent
              ? "A new booking has been made for"
              : "Thank you for booking your tour with"
          } <span class="highlight">${
    bookingDetails.agencyName
  }</span> through Trippie. Here are the booking details:</p>
          
          <h2>Tour Details</h2>
          <p><strong>Tour Name:</strong> ${bookingDetails.tourName}</p>
          <p><strong>Type:</strong> ${bookingDetails.type}</p>
          <p><strong>Destinations:</strong> ${bookingDetails.destinations.join(
            ", "
          )}</p>
          <p><strong>Start Date:</strong> ${new Date(
            bookingDetails.startDate
          ).toLocaleString()}</p>
          <p><strong>End Date:</strong> ${new Date(
            bookingDetails.endDate
          ).toLocaleString()}</p>
          <p><strong>Meeting Point:</strong> ${bookingDetails.meetingPoint}</p>
          <p><strong>Contact Info:</strong> ${bookingDetails.contactInfo.join(
            ", "
          )}</p>
          
          <h2>Participant Information</h2>
          <p><strong>Total Participants:</strong> ${
            bookingDetails.totalParticipant
          }</p>
          
          <h2>Participant Details</h2>
          <p>Name: ${bookingDetails.participantData.name}</p>
          <p>Email: ${bookingDetails.participantData.email}</p>
          <p>Phone: ${bookingDetails.participantData.phone}</p>
     
          <h2>Payment Details</h2>
          <p><strong>Payment ID:</strong> ${bookingDetails.paymentId}</p>
          <p><strong>Total Price:</strong> ${bookingDetails.totalPrice}</p>
          <p><strong>Amount Paid:</strong> ${bookingDetails.bookingAmount}</p>
          <p><strong>Due Amount:</strong> ${bookingDetails.dueAmount}</p>

          <h2>Agency Details</h2>
          <p><strong>Agency Name:</strong> ${bookingDetails.agencyName}</p>
          <p><strong>Agency Email:</strong> ${bookingDetails.agencyEmail}</p>
          <p><strong>Agency Mobile:</strong> ${bookingDetails.agencyMobile}</p>

          ${!isAgent ? '<a href="#" class="button">View Your Booking</a>' : ""}
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

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const msg = {
      to,
      from: process.env.SENDGRID_SENDER_EMAIL,
      subject,
      html: htmlContent,
    };

    // Send the email
    const response = await sgMail.send(msg);
    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error(
      "Error occurred during email sending:",
      error.response ? error.response.body : error
    );
  }
};

const sendTourBookingEmails = (bookingDetails) => {
  // Ensure participantData is defined and has at least one participant
  if (
    !bookingDetails.participantData ||
    bookingDetails.participantData.length === 0
  ) {
    console.error("Participant data is missing or empty");
    return;
  }

  // Send email to booking user
  const userEmailContent = generateEmailContent(
    bookingDetails.participantData.name,
    bookingDetails
  );
  sendEmail(
    bookingDetails.userEmail,
    "Tour Booking Confirmation",
    userEmailContent
  );

  // Send email to participant if different from booking user
  if (bookingDetails.userEmail !== bookingDetails.participantData.email) {
    const participantEmailContent = generateEmailContent(
      bookingDetails.participantData.name,
      bookingDetails
    );
    sendEmail(
      bookingDetails.participantData.email,
      "Tour Booking Confirmation",
      participantEmailContent
    );
  }

  // Send email to agent
  const agentEmailContent = generateEmailContent(
    bookingDetails.agent.split("@")[0],
    bookingDetails,
    true
  );
  sendEmail(
    bookingDetails.agent,
    "New Booking Notification",
    agentEmailContent
  );

  // Send email to agency if different from agent
  if (bookingDetails.agent !== bookingDetails.agencyEmail) {
    const agencyEmailContent = generateEmailContent(
      bookingDetails.agencyName,
      bookingDetails,
      true
    );
    sendEmail(
      bookingDetails.agencyEmail,
      "New Booking Notification",
      agencyEmailContent
    );
  }
};

module.exports = { sendTourBookingEmails };
