const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./src/db/connectDB");
const cookieParser = require("cookie-parser");
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");
const hotelRoutes = require("./src/routes/hotelRoutes");
const roomRoutes = require("./src/routes/roomRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const agencyRoutes = require("./src/routes/agencyRoutes");
const tourRoutes = require("./src/routes/tourRoutes");
const subscriptionRoutes = require("./src/routes/subscriptionRoutes");
const subscriptionScheduler = require("./src/schedulers/subscriptionScheduler");

const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://travel-with-trippie.web.app",
      "https://travel-with-trippie.firebaseapp.com",
      "https://trippie-app-client.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// connect to db
connectDB();

// user related routes
app.use("/api/users", userRoutes);

// auth related routes
app.use("/api/auth", authRoutes);

// hotel related routes
app.use("/api/hotels", hotelRoutes);

// room related routes
app.use("/api/rooms", roomRoutes);

// payment related routes
app.use("/api/payment", paymentRoutes);

// tour agency related routes
app.use("/api/tour-agencies", agencyRoutes);

// tour related routes
app.use("/api/tours", tourRoutes);

// subscription related routes
app.use("/api/subscription", subscriptionRoutes);

app.get("/", (req, res) => {
  res.send("Trippie server is running!");
});

// Start the scheduler
subscriptionScheduler();

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
