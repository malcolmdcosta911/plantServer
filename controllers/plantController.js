const { Plant, validatePlant } = require("../models/plant");
const { PlantCategory } = require("../models/plantcategory");

const addPlant = async (req, res) => {
  const { error } = validatePlant(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  let categories = await PlantCategory.find({
    _id: { $in: req.body.categoryIds },
  });

  // console.log(categories, req.body.categoryIds);

  if (
    categories?.length === 0 ||
    categories?.length !== req.body.categoryIds?.length
  )
    return res.status(400).json({ message: "Please enter valid category ids" });

  let plant = await Plant.findOne({ name: req.body.name });
  if (plant) return res.status(400).json({ message: "Plant already exists" });

  plant = new Plant({
    name: req.body.name,
    description: req.body.description,
    location: {
      type: "Point", //Note that longitude comes first in a GeoJSON coordinate array, not latitude.
      coordinates: [Number(req.body.longitude), Number(req.body.latitude)],
    },
    categories: categories.map((cat) => ({ _id: cat._id, name: cat.name })),
  });

  plant.save();
  return res.status(200).json({ message: "category added", data: { plant } });
};

const getAllPlants = async (req, res) => {
  const plants = await Plant.find().select("-__v");
  return res.status(200).json({ data: { plants } });
};

module.exports = { addPlant, getAllPlants };
