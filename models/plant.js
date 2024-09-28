const mongoose = require("mongoose");

const Joi = require("joi");
const { pointSchema } = require("./point");
const { plantCategorySchema } = require("./plantcategory");
const { User } = require("./user");

const plantSchema = new mongoose.Schema({
  //need to add images
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 255,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [
      {
        filename: {
          type: String,
          required: true,
        },
      },
    ],
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

  createdBy: {
    type: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // This refers to the User model
        required: true,
      },
    },
    required: true,
  },
});

plantSchema.post("save", async function (doc) {
  let user = await User.findOne({ _id: doc.createdBy.userId });
  if (!user) return;
  if (user.roles.includes("admin")) return; //only notify admin  if user adds plant
  plantAddEventEmitter.emit("plantAdded", [{ plantId: doc._id }]);
});

const Plant = mongoose.model("Plant", plantSchema);

function validatePlant(category) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    description: Joi.string().required(),
    longitude: Joi.number().min(-180).max(180).required(), //acepts string as long as numbers used
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

//http://localhost:3500/images/images-1711624996077.jpg
