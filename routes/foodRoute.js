const express = require('express')
const router = express.Router()
const upload = require('../middlewares/uploadMiddleware')

const { addFood, getAllFood, deleteFood, updateFood } = require('../controllers/foodController');


router.get("/", getAllFood)
router.post("/",upload.single("image"), addFood)
router.put("/:id",upload.single("image"), updateFood)
router.delete("/:id", deleteFood)








module.exports = router