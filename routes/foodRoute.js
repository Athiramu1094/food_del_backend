const express = require('express')
const router = express.Router()
const upload = require('../middlewares/uploadMiddleware')

const { addFood, getAllFood, deleteFood, updateFood } = require('../controllers/foodController');


router.get("/", getAllFood)
router.post("/", upload.fields([{ name: 'mainImage' }, { name: 'image' }]), addFood);
router.put("/:id", upload.fields([{ name: 'mainImage' }, { name: 'image' }]), updateFood);
router.delete("/:id", deleteFood)








module.exports = router