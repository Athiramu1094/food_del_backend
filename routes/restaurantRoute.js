const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");

const {
  addRestaurant,
  getAllRestaurants,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantById,
} = require("../controllers/restaurantController");

router.get("/", getAllRestaurants);

router.get("/:id", getRestaurantById);

router.post("/", upload.single("image"), addRestaurant);

router.put("/:id", upload.single("image"), updateRestaurant);

router.delete("/:id", deleteRestaurant);

module.exports = router;
