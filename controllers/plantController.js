const { Plant, validatePlant } = require("../models/plant");
const { PlantCategory } = require("../models/plantcategory");
const plantImagesUpload = require("../utils/filesHandler");
// var fs = require("fs");
// var path = require("path");
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
    return res.status(200).json({ message: "category added", data: { plant } }); //data: { plant }
  } catch (err) {
    // Handle the error appropriately, e.g., by sending a response with the error message
    // console.error(err);
    return res.status(400).json({ message: err.message });
    // next(err);
  }
};

const getAllPlants = async (req, res) => {
  const plants = await Plant.find().select("-__v");
  return res.status(200).json({ data: { plants } });
};

module.exports = { addPlant, getAllPlants };
