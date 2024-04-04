const { User } = require("../models/user");
const { Plant } = require("../models/plant");
const { PlantCategory } = require("../models/plantcategory");
const getAdminDashboard = async (req, res, next) => {
  //   const numUsers = await User.estimatedDocumentCount(); //exclude admin role
  const numUsers = await User.countDocuments({ roles: { $ne: "admin" } });

  const numPlants = await Plant.estimatedDocumentCount();
  const numPlantCategory = await PlantCategory.estimatedDocumentCount();


  ////recent  users other than admin
  const newUsers = await User.find({ roles: { $ne: "admin" } })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("name email createdAt");

  const plantsPerMonth = await Plant.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" }, // Group by the month number
        plantsAdded: { $sum: 1 }, // Count the number of documents in each group
      },
    },
    {
      $project: {
        _id: false, // Remove the default _id field
        name: {
          // Map the month number to its name
          $arrayElemAt: [
            [
              "", // Placeholder for month 0 (not used)
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            "$_id",
          ],
        },
        plantsAdded: true, // Keep the count
      },
    },
  ]);

  return res.status(200).json({
    data: { numUsers, numPlants, numPlantCategory, newUsers, plantsPerMonth },
  });
};

module.exports = { getAdminDashboard };

// User.find({ roles: { $ne: 'admin' } }) searches for users whose roles array does not contain the string "admin". The $ne operator is used for "not equal" comparisons.
// .sort({ createdAt: -1 }) sorts the results by the createdAt field in descending order, ensuring that the most recently created users are returned first.
