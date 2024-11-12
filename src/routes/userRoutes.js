// // routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Add a user to the collection
router.post("/", async (req, res) => {
  try {
    const user = req.body;
    const { email } = user;

    // Check if the user already exists
    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(409).send({ message: "User already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    // Create a new user
    const newUser = {
      ...user,
      password: hashedPassword,
    };

    const result = await User.create(newUser);
    res.status(201).send({ message: "User added successfully" });
  } catch (error) {
    console.error("Error adding user:", error);
    return res
      .status(500)
      .send({ error: true, message: "Internal Server Error" });
  }
});

module.exports = router;
