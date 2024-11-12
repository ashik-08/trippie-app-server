const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// login route
router.post("/login", async (req, res) => {
  try {
    const user = req.body;
    console.log("from /api/auth/login -- user:", user);
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "2h",
    });
    console.log("from /api/auth/login -- token:", token);
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      })
      .send({ success: true });
  } catch (error) {
    console.log(error);
    return res.send({ error: true, message: error.message });
  }
});

// logout route
router.post("/logout", async (req, res) => {
  try {
    const user = req.body;
    console.log("from /api/auth/logout -- logging out:", user);
    res
      .clearCookie("token", {
        maxAge: 0,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      })
      .send({ success: true });
  } catch (error) {
    console.log(error);
    return res.send({ error: true, message: error.message });
  }
});

module.exports = router;
