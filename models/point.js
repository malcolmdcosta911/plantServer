const mongoose = require("mongoose");


//The most simple structure in GeoJSON is a point. 
const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
    // default: ["Point"],
  },
  coordinates: {
    type: [Number], //Note that longitude comes first in a GeoJSON coordinate array, not latitude.
    required: true,
  },
});

// const Point = mongoose.model("Point", pointSchema);

module.exports = {
  pointSchema,
};

// {
//     "type" : "Point",
//     "coordinates" : [
//       -122.5,
//       37.7
//     ]
//   }
