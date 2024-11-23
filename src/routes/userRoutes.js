// src/routes/userRoutes.js
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/User");
const verifyToken = require("../middlewares/verifyToken");
const verifyRole = require("../middlewares/verifyRole");

// add a new user to the collection
router.post("/", async (req, res) => {
  try {
    const user = req.body;
    const { email } = user;

    // Check if the user already exists
    const isExist = await User.findOne({ email });

    if (!isExist && !user.password) {
      await User.create(user);
      return res.status(201).send({ message: "User added successfully" });
    } else if (isExist && !user.password) {
      return res.status(200).send({ message: "Login" });
    }

    if (isExist && user.password) {
      return res.status(409).send({ message: "User already exists" });
    } else if (!isExist && user.password) {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);

      // Create a new user
      const newUser = {
        ...user,
        password: hashedPassword,
      };

      await User.create(newUser);
      return res.status(201).send({ message: "User added successfully" });
    }
  } catch (error) {
    console.error("Error adding user:", error);
    return res
      .status(500)
      .send({ error: true, message: "Internal Server Error" });
  }
});

// get a user role by email
router.get("/role", verifyToken, async (req, res) => {
  try {
    const email = req.query?.email;
    if (email !== req.decoded?.email) {
      return res.status(403).send({ message: "Forbidden" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send({ role: user.role });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});

// get all users  -- checked
router.get("/", verifyToken, verifyRole(["admin"]), async (req, res) => {
  try {
    const result = await User.find();
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    return res.send({ error: true, message: "Internal Server Error" });
  }
});

// update a user role
router.patch("/:id", verifyToken, verifyRole(["admin"]), async (req, res) => {
  try {
    const query = { _id: req.params.id };
    const updatedUser = {
      $set: {
        role: req.body.newRole,
      },
    };
    const result = await User.updateOne(query, updatedUser);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: true, message: "Internal Server Error" });
  }
});

module.exports = router;
