const mongoose = require("mongoose");

const Joi = require("joi");

const plantCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 255,
    // unique: true, //added uniquie //reused so cannot add
  },
});

const PlantCategory = mongoose.model("PlantCategory", plantCategorySchema);

function validatePlantCategory(category) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
  });

  return schema.validate(category);
}

module.exports = {
  plantCategorySchema,
  validatePlantCategory,
  PlantCategory,
};
