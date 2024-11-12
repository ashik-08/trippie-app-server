const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./src/db/connectDB");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// connect to db
connectDB();

app.get("/", (req, res) => {
  res.send("Trippie server is running!");
});

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
