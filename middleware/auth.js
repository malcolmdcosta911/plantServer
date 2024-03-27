const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.get("x-auth-token");

  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  // 401 Unauthorized
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = decoded;
    return next();
  } catch (error) {
    // return res.status(400).json("Invalid token.");
    return res.status(401).json({ message: "Invalid token." });
  }
};
