const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./src/db/connectDB");
const port = process.env.PORT || 5000;
const userRoutes = require("./src/routes/userRoutes");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// connect to db
connectDB();

// user related routes
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Trippie server is running!");
});

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
