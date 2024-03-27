const mongoose = require("mongoose");
const logger = require("../utils/logger");

module.exports = function () {
  const db = process.env.MONGO_URL;
  mongoose.connect(db).then(() => logger.info(`Connected to ${db}...`));
};
