const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { wishlistSchema } = require("./whislist");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minLength: 2,
    maxLength: 255,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    minLength: 10,
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 1024, // hashed and stored
  },
  resetToken: {
    type: String,
  },
  preferences: {
    theme: {
      type: String,
      default: "light",
    },
    notifications: {
      type: Boolean,
      default: true,
    },
  },
  wishlist: {
    //need to update entire doc to change
    type: [wishlistSchema],
    //required: true
  },
  roles: {
    type: [String],
    enum: ["user", "admin"], //enum only for predefined set of values
    default: ["user"],
  },
});

userSchema.static({
  checkDuplicate: function (phone, email) {
    return this.findOne({
      $or: [{ phone }, { email }],
    });
  },
  //   , findByCost: function () {..}
});

userSchema.methods.generateAuthToken = function generateAuthToken(expiry = "") {
  const options = {};

  // Assuming 'condition' is your condition to decide whether to include expiresIn
  if (expiry) {
    // options.expiresIn = "1h";
    options.expiresIn = expiry;
  }

  const token = jwt.sign(
    {
      email: this.email,
      name: this.name,
      roles: this.roles,
      _id: this._id,
    },
    process.env.JWT_PRIVATE_KEY,
    options
  );
  return token;
};

userSchema.methods.generateHashPassword = function generateHashPassword(
  password
) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

const User = mongoose.model("User", userSchema);

// function validateUser(user) {
//   const schema = Joi.object({
//     name: Joi.string().min(2).max(50).required(),
//     email: Joi.string().min(2).max(255).email().required(),
//     phone: Joi.string().min(10).required(),
//     password: Joi.string().min(2).max(255).required(),
//   });

//   return schema.validate(user);
//   // -> { value: {}, error: '"username" is required' }
// }

// Base schema for common user fields
const baseUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().min(2).max(255).email().required(),
  phone: Joi.string().min(10).required(),
  password: Joi.string().min(8).max(255).required(),
});

// Function to validate user with base schema
function validateUser(user) {
  return baseUserSchema.validate(user);
}
// Function to validate authentication with email and password only
function validateAuth(user) {
  const authSchema = baseUserSchema.keys({
    name: Joi.forbidden(), //forbidden -- remove not used
    phone: Joi.forbidden(),
  });
  return authSchema.validate(user);
}

// Function to validate user phone
function validateUserPhone(user) {
  const phoneSchema = baseUserSchema.keys({
    name: Joi.forbidden(),
    email: Joi.forbidden(),
    password: Joi.forbidden(),
  });
  return phoneSchema.validate(user);
}

function validateUserPassword(user) {
  const schema = Joi.object({
    password: Joi.string().min(8).max(255).required(),
    confirm_password: Joi.string()
      .equal(Joi.ref("password"))
      .messages({ "any.only": "passwords do not match" })
      .required(),
  });
  return schema.validate(user);
}

// Function to validate user password
// function validateUserPassword(user) {
//   const passwordSchema = baseUserSchema.keys({
//     name: Joi.forbidden(),
//     email: Joi.forbidden(),
//     phone: Joi.forbidden(),
//   });
//   return passwordSchema.validate(user);
// }

module.exports = {
  User,
  validateUser,
  validateAuth,
  validateUserPhone,
  validateUserPassword,
};
