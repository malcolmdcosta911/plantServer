const cors = require("cors");

const corsOptions = {
  origin: true,
  // origin: "http://localhost:5173", // Replace with your client's origin
  credentials: true,
  //credentials: Configures the Access-Control-Allow-Credentials CORS header. Set to true to pass the header, otherwise it is omitted.
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

module.exports = function (app) {
  app.use(cors(corsOptions));
};
