const jwt = require("jsonwebtoken");
require("dotenv").config();

// cookies token middleware function
const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;
  console.log("Value of token in middleware: ", token);
  if (!token) {
    return res.status(401).send({ auth: false, message: "Not authorized" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    // error
    if (err) {
      console.log(err);
      return res.status(401).send({ message: "Unauthorized" });
    }
    // if token is valid then it would be decoded
    console.log("Value in the token: ", decoded);
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
