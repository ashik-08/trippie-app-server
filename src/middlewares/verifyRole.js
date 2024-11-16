const User = require("../models/User");

const verifyRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const email = req.decoded.email;
      const user = await User.findOne({ email });
      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).send({ message: "Forbidden" });
      }
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).send({ error: true, message: error.message });
    }
  };
};

module.exports = verifyRole;
