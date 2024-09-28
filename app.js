require("dotenv").config();
const express = require("express");
const logger = require("./utils/logger");
const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io");
const socketAuth = require("./middleware/socketAuth");

require("./startup/logging");
require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  /* options */
  cors: {
    // origin: true,
    origin: "*",
  },
});

require("./startup/sockets")(io);

const port = process.env.PORT || 3500;
httpServer.listen(port, () => logger.info(`Listening on port ${port}...`));

// const port = process.env.PORT || 3000;
// app.listen(port, () => logger.info(`Listening on port ${port}...`));
