// const bcrypt = require("bcrypt");
const { User, validateUser } = require("../models/user");

//message, data, token

const register = async (req, res, next) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  let user = await User.checkDuplicate(req.body.phone, req.body.email);
  if (user) return res.status(400).json({ message: "User already registered" });

  // const salt = bcrypt.genSaltSync(10);
  // const hash = bcrypt.hashSync(req.body.password, salt);

  user = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    // password: hash,
  });

  const hash = user.generateHashPassword(req.body.password);
  user.password = hash;

  await user.save();
  return res.json({ message: "sucess" });
};

const userProfile = async (req, res, next) => {
  const user = await User.findById(req.user._id).select(
    "-__v -password -roles -resetToken"
  );
  return res.status(200).json({ data: { user } });
};

const getAllUsers = async (req, res) => {
  //all users other than admin
  const users = await User.find({ roles: { $ne: "admin" } })
    .sort({ createdAt: -1 })
    .select("name email phone createdAt")
    .select("-__v");

  return res.status(200).json({ data: { users } });
};

module.exports = { register, userProfile, getAllUsers };
