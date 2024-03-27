module.exports = function (err, req, res, next) {
  if (!req.user?.roles.includes("admin"))
    // return res.status(400).json("Access denied.");
    return res.status(403).json({ message: "Access denied." });
  // 403 Forbidden
  next();
};
