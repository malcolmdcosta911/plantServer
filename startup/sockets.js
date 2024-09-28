const socketAuth = require("../middleware/socketAuth");
const logger = require("../utils/logger");
const helmet = require("helmet");
const EventEmitter = require("node:events");

const plantAddEventEmitter = new EventEmitter();
global.plantAddEventEmitter = plantAddEventEmitter;

module.exports = function (io) {
  io.on("connection", (socket) => {
    // socket.data.username = "alice";
    logger.info("socket connection sucess");
    const count = io.sockets.server.engine.clientsCount;
    console.log(`Client connected. Total clients: ${count}`);
    //   io.use(socketAuth);
    //console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    // socket.emit("foo", [{ plantId: "637468642" }]);
    socket.on("userLogout", () => {
      logger.info(`User logged out`);
      socket.disconnect(true);
      const count = io.sockets.server.engine.clientsCount;
      console.log(`Client disconnected. Total clients: ${count}`);
    });
  });

  //   const count = io.engine.clientsCount;
  //   console.log("count", count);

  //only admin connects to socket and recieve msg else all disconnect
  io.use(socketAuth);

  plantAddEventEmitter.on("plantAdded", (data) => {
    io.emit("plantAdded", data);
  });

  //add only on production later
  io.engine.use(helmet());

  //global.io = io; //can call io emit anywhere
  //not recommended due to potential issues with code maintainability, testing, and security.

  io.engine.on("connection_error", (err) => {
    logger.error(err.message, err);
    // console.log(err.req); // the request object
    // console.log(err.code); // the error code, for example 1
    // console.log(err.message); // the error message, for example "Session ID unknown"
    // console.log(err.context); // some additional error context
  });
};
