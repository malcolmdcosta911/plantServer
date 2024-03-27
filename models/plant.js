const mongoose = require("mongoose");

const Joi = require("joi");
const { pointSchema } = require("./point");
const { plantCategorySchema } = require("./plantcategory");

const plantSchema = new mongoose.Schema({
  //need to add images
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 255,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: pointSchema,
    required: true, //just allow both  user and admin to add for now on api
  },
  categories: {
    //updates to embedded documents require saving the entire parent document,
    //validate before save if plantCategorySchema exists
    type: [plantCategorySchema],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Plant = mongoose.model("Plant", plantSchema);

function validatePlant(category) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    description: Joi.string().required(),
    longitude: Joi.number().min(-180).max(180).required(),
    latitude: Joi.number().min(-90).max(90).required(),
    categoryIds: Joi.array()
      .items(
        Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .message("Invalid category id ")
          .required()
      )
      .required(),
  });

  return schema.validate(category);
}

module.exports = {
  Plant,
  validatePlant,
};
