const bcrypt = require("bcrypt");
const {
  User,
  validateAuth,
  validateUserPhone,
  validateUserPassword,
} = require("../models/user");
const otpGenerator = require("otp-generator");
const { Otp, validateOtp } = require("../models/otp");
const jwt = require("jsonwebtoken");

// Reusable function for common login logic
const performLogin = async (req, res, next, isAdmin = false) => {
  const { error } = validateAuth(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  let user = await User.findOne({ email: req.body.email });
  // if (!user) return res.status(404).json("Invalid email or password.");
  if (!user)
    return res.status(404).json({ message: "Invalid email or password." });

  if (isAdmin && !user.roles.includes("admin"))
    // return res.status(400).json("Access denied.");
    return res.status(401).json({ message: "Access denied." });

  const validPassword = bcrypt.compareSync(req.body.password, user.password);
  if (!validPassword)
    return res.status(404).json({ message: "Invalid email or password." });

  const token = user.generateAuthToken("4h");
  return res.status(200).json({ token: token });
};

const login = async (req, res, next) => {
  return performLogin(req, res, next);
};

const adminLogin = async (req, res, next) => {
  return performLogin(req, res, next, true);
};

const verifyPhone = async (req, res) => {
  const { error } = validateUserPhone(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  let user = await User.findOne({ phone: req.body.phone });
  if (!user) return res.status(404).json({ message: "No such user found" });

  //prevent generate otp till old one deleted by mongo after 2 mins
  //within 2 mins cannot ask another password reset unless prev used and made invalid
  //prevent server overload
  const otpAlreadySent = await Otp.findOne({
    phone: req.body.phone,
    invalid: false,
  });
  if (otpAlreadySent)
    return res.status(429).json({ message: "Otp already sent" });

  let generatedOtp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  let result = await Otp.findOne({ otp: generatedOtp });
  //check if otp is unique
  //2 people can request otp at the same time

  //otp already present
  while (result) {
    generatedOtp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    result = await Otp.findOne({ otp: generatedOtp });
  }

  //store and send otp
  await Otp.create({ phone: req.body.phone, otp: generatedOtp });
  return res.status(200).json({ message: "OTP sent successfully" });
};

//no two people can have same otp cause prevented otp duplication and deleted old after 2 mins
const verifyOtp = async (req, res) => {
  const { error } = validateOtp(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const otp = await Otp.findOne({ otp: req.body.otp, invalid: false });
  if (!otp) return res.status(409).json({ message: "The OTP is not valid" });

  let user = await User.findOne({ phone: otp.phone }).select("phone");
  if (!user) return res.status(404).json({ message: "Invalid Mobile No" });

  //invalid token in 5 min cause prevent reuse of password  page
  //can take someones token and call api and reset password hence best way expire soon

  const resetToken = jwt.sign(
    {
      phone: user.phone,
    },
    process.env.RESET_TOKEN_SECRET_KEY,
    { expiresIn: "10m" }
  );

  //save token in db
  user.resetToken = resetToken;
  await user.save();

  //cannot use same otp twice-----------------
  //maybe can reuse old otp once invalid and shorten while loop
  otp.invalid = true;
  await otp.save();

  return res
    .status(200)
    .cookie("x-reset-token", resetToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 10 * 60 * 1000, //10 minutes
    })
    .json({ message: "Otp verified successfully" });
};

const resetPassword = async (req, res) => {
  const resetToken = req?.cookies?.["x-reset-token"];
  // if (!resetToken) return res.status(401).json("no reset token found");
  if (!resetToken)
    return res.status(498).json({ message: "Reset has expired" });

  //password ---> need user details to reset
  const { error } = validateUserPassword(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const user = await User.findOne({ resetToken });
  if (!user) return res.status(404).json({ message: "No such user found" });

  //verify if actual user jwt
  jwt.verify(
    resetToken,
    process.env.RESET_TOKEN_SECRET_KEY,
    async function (err, decoded) {
      if (err || user.phone !== decoded.phone) {
        //reset token and clear cookie on resetToken error
        user.resetToken = "";
        await user.save();
        return res
          .clearCookie("x-reset-token", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
          })
          .status(404)
          .json({ message: "Reset has expired." });
      }
      // return res.status(404).json("Invalid reset token.");

      //remove
      const hash = user.generateHashPassword(req.body.password);
      user.password = hash;
      user.resetToken = "";
      await user.save();

      return res
        .clearCookie("x-reset-token", {
          httpOnly: true,
          sameSite: "None",
          secure: true,
        })
        .status(200)
        .json({ message: "Password reset sucess" });
    }
  );
};

module.exports = { login, adminLogin, verifyPhone, verifyOtp, resetPassword };
