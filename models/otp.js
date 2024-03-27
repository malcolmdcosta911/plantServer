const mongoose = require("mongoose");
const Joi = require("joi");
const otpSender = require("../utils/otpSender");
const otpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    // unique: true,
    minLength: 10,
  },
  invalid: {
    //invalid after use
    type: Boolean,
    required: true,
    default: false,
  },
  otp: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 6, // hashed and stored
  },
  //SchemaType.prototype.index()
  //SchemaDateOptions.prototype.expires
  expireAt: {
    type: Date,
    default: Date.now,
    expires: 120,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//even if save fails this runs
otpSchema.pre("save", async function (next) {
  if (this.$isNew) {
    //send otp
    console.log("otpppppp sent----", this.phone, this.otp);
    try {
      // await otpSender(this.phone, this.otp);
    } catch (error) {
      //otp error handle
      console.log(error);
    }
  }

  next();
});

const Otp = mongoose.model("Otp", otpSchema);

function validateOtp(otp) {
  const schema = Joi.object({
    otp: Joi.string().min(6).max(6).required(),
  });

  return schema.validate(otp);
}

module.exports = {
  Otp,
  validateOtp,
};
