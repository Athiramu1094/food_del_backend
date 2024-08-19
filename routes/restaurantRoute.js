const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');

const { addRestaurant, getAllRestaurants,  updateRestaurant, deleteRestaurant } = require('../controllers/restaurantController');


router.get("/", getAllRestaurants)

router.post("/", upload.single("image"), addRestaurant)

router.put("/:id", upload.single("image"), updateRestaurant)

router.delete("/:id", deleteRestaurant)




module.exports = router
