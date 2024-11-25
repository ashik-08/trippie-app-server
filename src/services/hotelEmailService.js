const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateEmailContent = (
  recipientName,
  bookingDetails,
  isManager = false
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
            isManager
              ? "New Booking Notification"
              : "Hotel Booking Confirmation"
          }</h1>
        </div>
        <div class="email-content">
          <p>Dear <span class="highlight">${recipientName}</span>,</p>
          <p>${
            isManager
              ? "A new booking has been made for"
              : "Thank you for booking your stay with"
          } <span class="highlight">${
    bookingDetails.hotelName
  }</span> through Trippie. Here are the booking details:</p>
          
          <h2>Hotel Details</h2>
          <p><strong>Hotel Name:</strong> ${bookingDetails.hotelName}</p>
          <p><strong>Location:</strong> ${bookingDetails.location}</p>
          
          <h2>Guest Information</h2>
          <p><strong>Name:</strong> ${bookingDetails.guestData.name}</p>
          <p><strong>Email:</strong> ${bookingDetails.guestData.email}</p>
          <p><strong>Phone:</strong> ${bookingDetails.guestData.phone}</p>
          
          <h2>Booking Details</h2>
          <p><strong>Check-in Date:</strong> ${bookingDetails.checkInDate}</p>
          <p><strong>Check-out Date:</strong> ${bookingDetails.checkOutDate}</p>
          <p><strong>Room Numbers:</strong> ${bookingDetails.roomNumbers.join(
            ", "
          )}</p>
          
          <h2>Payment Details</h2>
          <p><strong>Payment ID:</strong> ${bookingDetails.paymentId}</p>
          <p><strong>Total Price:</strong> ${bookingDetails.totalPrice}</p>
          <p><strong>Amount Paid:</strong> ${bookingDetails.bookingAmount}</p>
          <p><strong>Due Amount:</strong> ${bookingDetails.dueAmount}</p>

          ${
            !isManager ? '<a href="#" class="button">View Your Booking</a>' : ""
          }
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

const sendEmail = (to, subject, htmlContent) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: htmlContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

const sendHotelBookingEmails = (bookingDetails) => {
  // Send email to booking user
  const userEmailContent = generateEmailContent(
    bookingDetails.guestData.name,
    bookingDetails
  );
  sendEmail(
    bookingDetails.userEmail,
    "Hotel Booking Confirmation",
    userEmailContent
  );

  // Send email to guest if different from booking user
  if (bookingDetails.userEmail !== bookingDetails.guestData.email) {
    const guestEmailContent = generateEmailContent(
      bookingDetails.guestData.name,
      bookingDetails
    );
    sendEmail(
      bookingDetails.guestData.email,
      "Hotel Booking Confirmation",
      guestEmailContent
    );
  }

  // Send email to hotel manager
  const managerEmailContent = generateEmailContent(
    bookingDetails.hotelManager,
    bookingDetails,
    true
  );
  sendEmail(
    bookingDetails.hotelManagerEmail,
    "New Booking Notification",
    managerEmailContent
  );
};

module.exports = { sendHotelBookingEmails };
