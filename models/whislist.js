const mongoose = require("mongoose");
const { Schema } = mongoose;

const wishlistSchema = new Schema({
  plantId: { type: Schema.Types.ObjectId, ref: "Plant", required: true },
});

module.exports = { wishlistSchema };
