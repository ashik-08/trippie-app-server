const jwt = require("jsonwebtoken");
require("dotenv").config();

// cookies token middleware function
const verifyToken = async (req, res, next) => {
  const token = req.cookies?.accessToken;
  console.log("accessToken in middleware: ", token);
  if (!token) {
    return res.status(401).send({ auth: false, message: "Not authorized" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      if (err.name === "TokenExpiredError") {
        return res.status(401).send({ message: "Token expired" });
      }
      return res.status(401).send({ message: "Unauthorized" });
    }
    // if token is valid then it would be decoded
    req.decoded = decoded;
    next();
  });
};

module.exports = verifyToken;
