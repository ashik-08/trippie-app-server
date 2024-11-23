const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendBookingConfirmationEmail = (to, bookingDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Booking Confirmation",
    html: `
      <h1>Booking Confirmation</h1>
      <p>Thank you for your booking from Trippie. Here are your booking details:</p>
      <h2>Hotel Details</h2>
      <p><strong>Hotel Name:</strong> ${bookingDetails.hotelName}</p>
      <p><strong>Location:</strong> ${bookingDetails.location}</p>
      <h2>Booking Details</h2>
      <p><strong>Check-in Date:</strong> ${bookingDetails.checkInDate}</p>
      <p><strong>Check-out Date:</strong> ${bookingDetails.checkOutDate}</p>
      <p><strong>Room Numbers:</strong> ${bookingDetails.roomNumbers.join(
        ", "
      )}</p>
      <h2>Payment Details</h2>
      <p><strong>Payment ID:</strong> ${bookingDetails.paymentId}</p>
      <p><strong>Total Amount:</strong> ${bookingDetails.totalPrice}</p>
      <p><strong>Amount Paid:</strong> ${bookingDetails.bookingAmount}</p>
      <p><strong>Due Amount:</strong> ${bookingDetails.dueAmount}</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

module.exports = { sendBookingConfirmationEmail };
