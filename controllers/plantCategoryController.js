const {
  validatePlantCategory,
  PlantCategory,
} = require("../models/plantcategory");

const addCategory = async (req, res) => {
  const { error } = validatePlantCategory(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  let category = await PlantCategory.find({ name: req.body.name });
  console.log(category);
  if (category?.length)
    return res.status(400).json({ message: "category already present" });

  category = new PlantCategory({
    name: req.body.name,
  });
  category.save();

  return res
    .status(200)
    .json({ message: "category added", data: { category } });
};

const getAllCategories = async (req, res) => {
  const categories = await PlantCategory.find().select("-__v");
  return res.status(200).json({ data: { categories } });
};

module.exports = { addCategory, getAllCategories };
