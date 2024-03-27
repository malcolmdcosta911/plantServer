const mongoose = require("mongoose");

module.exports = function (req, res, next) {
  const objectId = mongoose.Types.ObjectId.isValid(req.params.id); //needed for /:id endpoint
  if (!objectId) return res.status(404).json("Invalid ID");

  next();
};
//validate route object id send in request params
