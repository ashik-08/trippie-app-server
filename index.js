const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./src/db/connectDB");
const port = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");

app.use(
  cors({
    origin: "http://localhost:5173",
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

app.get("/", (req, res) => {
  res.send("Trippie server is running!");
});

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
