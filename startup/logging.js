require("express-async-errors");
const logger = require("../utils/logger");

process.on("uncaughtException", (err) => {
  logger.error(err.message, err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error(promise);
  process.exit(1);
});
