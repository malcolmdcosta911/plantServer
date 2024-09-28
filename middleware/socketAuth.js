const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

//req, res, next only for express
//for socket io its socket, next

module.exports = (socket, next) => {
  // console.log("middleware", socket.id); // Example usage

  const isHandshake = socket.handshake.query.sid === undefined;
  if (!isHandshake) {
    return next();
  }

  // const header = `bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1pbmVzaEBnbWFpbC5jb20iLCJuYW1lIjoiTWluZXNoa2EgRENvc3RhIiwicm9sZXMiOlsidXNlciJdLCJfaWQiOiI2NjA3ZjkwZDZjYWRlMjAyYjUzNWE5MjQiLCJpYXQiOjE3MTI0MjY0ODcsImV4cCI6MTcxMjQ0MDg4N30.RI9LBGJJQr6IXb59a_APO4PxPpkVFG77EHk_N8uCXbw`;
  const header = socket.handshake.headers.authorization;

  if (!header) {
    // return next(new Error("No token provided"));
    const err = new Error("No token provided");
    logger.error(err.message, err);
    socket.disconnect(true); //on client side not added ---> since won't be handled in react native app, hence handle on server
    return;
  }

  if (!header.startsWith("bearer ")) {
    //return next(new Error("Invalid token"));
    const err = new Error("Invalid token");
    logger.error(err.message, err);

    socket.disconnect(true);
    return;
  }
  const token = header.substring(7);

  try {
    const user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    if (!user || !user.roles || !user.roles.includes("admin")) {
      //return next(new Error("Access denied"));
      const err = new Error("Access denied");
      logger.error(err.message, err);
      socket.disconnect(true); //on client side ?
      return;
    }
    logger.info("auth sucesssss");
    return next(); //pass on sucess
  } catch (error) {
    // next(new Error("Invalid token"));
    const err = new Error("Invalid token");
    logger.error(err.message, err);
    socket.disconnect(true);
    return;
  }
};
