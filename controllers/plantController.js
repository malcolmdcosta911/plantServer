const { Plant, validatePlant } = require("../models/plant");
const { PlantCategory } = require("../models/plantcategory");
const plantImagesUpload = require("../utils/filesHandler");
// var fs = require("fs");
// var path = require("path");

const getAllPlants = async (req, res) => {
  const plants = await Plant.find().select("-__v");
  return res.status(200).json({ data: { plants } });
};

const getPlantByID = async (req, res) => {
  const plant = await Plant.findById({ _id: req.params.id }).select("-__v ");

  if (!plant)
    return res
      .status(404)
      .json({ message: "Plant with the given id was not found" });

  return res.status(200).json({ data: { plant } });
};

const addPlant = async (req, res, next) => {
  try {
    await plantImagesUpload(req, res);

    // console.log("addPlant", req?.body);
    //call after mutler cause mutler removes req.body
    const { error } = validatePlant(req?.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    //validation done in mutlter config
    const images = req.files.map((file) => ({
      filename: file.filename,
      // contentType: file.mimetype,
    }));

    let categories = await PlantCategory.find({
      _id: { $in: req.body.categoryIds },
    });

    if (
      categories?.length === 0 ||
      categories?.length !== req.body.categoryIds?.length
    )
      return res
        .status(400)
        .json({ message: "Please enter valid category ids" });

    let plant = await Plant.findOne({ name: req.body.name });
    if (plant) return res.status(400).json({ message: "Plant already exists" });

    plant = new Plant({
      name: req.body.name,
      description: req.body.description,
      location: {
        type: "Point",
        coordinates: [Number(req.body.longitude), Number(req.body.latitude)],
      },
      images: images,
      categories: categories.map((cat) => ({ _id: cat._id, name: cat.name })),
    });

    await plant.save();
    return res
      .status(200)
      .json({ message: "plant added sucessfully", data: { plant } }); //data: { plant }
  } catch (err) {
    // Handle the error appropriately, e.g., by sending a response with the error message
    // console.error(err);
    return res.status(400).json({ message: err.message });
    // next(err);
  }
};

//name is uniquie , cannot change name
const updatePlant = async (req, res, next) => {
  try {
    await plantImagesUpload(req, res);

    const { error } = validatePlant(req?.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    //validation done in mutlter config
    const images = req.files.map((file) => ({
      filename: file.filename,
      // contentType: file.mimetype,
    }));

    let categories = await PlantCategory.find({
      _id: { $in: req.body.categoryIds },
    });

    if (
      categories?.length === 0 ||
      categories?.length !== req.body.categoryIds?.length
    )
      return res
        .status(400)
        .json({ message: "Please enter valid category ids" });

    const plant = await Plant.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        location: {
          type: "Point",
          coordinates: [Number(req.body.longitude), Number(req.body.latitude)],
        },
        images: images,
        categories: categories.map((cat) => ({ _id: cat._id, name: cat.name })),
      },
      { new: true }
    );
    if (!plant)
      return res
        .status(404)
        .json({ message: "Plant with the given id was not found" });

    return res.status(200).json({ message: "plant  updated", data: { plant } }); //data: { plant }
  } catch (err) {
    // Handle the error appropriately, e.g., by sending a response with the error message
    console.error(err);
    return res.status(400).json({ message: err.message });
    // next(err);
  }
};
const deletePlant = async (req, res) => {
  const { deletedCount } = await Plant.deleteOne({ _id: req.params.id }); // returns {deletedCount: 1}

  if (!deletedCount)
    return res
      .status(404)
      .json({ message: "Plant with the given id was not found" });

  return res.status(200).json({ message: "Plant deleted sucessfully" });
};

module.exports = {
  addPlant,
  getAllPlants,
  getPlantByID,
  deletePlant,
  updatePlant,
};
