const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "2h" });
};

const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

// login route
router.post("/login", async (req, res) => {
  try {
    const user = req.body;
    console.log("from /api/auth/login -- user:", user);
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    console.log("from /api/auth/login -- accessToken:", accessToken);
    console.log("from /api/auth/login -- refreshToken:", refreshToken);
    res
      .cookie("accessToken", accessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 2 * 60 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .send({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: true, message: error.message });
  }
});

// logout route
router.post("/logout", async (req, res) => {
  try {
    const user = req.body;
    console.log("from /api/auth/logout -- logging out:", user);
    res
      .clearCookie("accessToken", {
        maxAge: 0,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      })
      .clearCookie("refreshToken", {
        maxAge: 0,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      })
      .send({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: true, message: error.message });
  }
});

// refresh token route
router.post("/refresh-token", async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).send({ message: "Refresh token not found" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).send({ message: "Invalid refresh token" });
      }

      const newAccessToken = generateAccessToken({ email: user.email });
      res
        .cookie("accessToken", newAccessToken, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production" ? true : false,
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          maxAge: 2 * 60 * 60 * 1000,
        })
        .send({ success: true });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: true, message: error.message });
  }
});

module.exports = router;
