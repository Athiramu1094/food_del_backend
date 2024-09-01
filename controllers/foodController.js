const { cloudinaryInstance } = require("../config/cloudinaryConfig.js");
const Food = require("../models/foodModel.js");

const getAllFood = async (req, res) => {
  try {
    const { restaurant, category } = req.query; // Get restaurant ID and category from query params
    let filter = {};

    if (restaurant) {
      filter.restaurant = restaurant;
    }
    if (category) {
      filter.category = category;
    }

    const foods = await Food.find(filter); // No population
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error("Error fetching foods:", error);
    res.status(500).json({ success: false, message: "An error occurred while fetching foods" });
  }
};




const addFood = async (req, res) => {
  try {
    
    if (!req.files) {
      return res
        .status(400)
        .json({ success: false, message: "No image file uploaded" });
    }

    const mainImageUpload = await cloudinaryInstance.uploader.upload(
      req.files.mainImage[0].path
    );
    const imageUpload = await cloudinaryInstance.uploader.upload(
      req.files.image[0].path
    );
    
  
    const food = new Food({
      name: req.body.name,
      description:req.body.description,
      price: req.body.price,
      category: req.body.category,
      mainImage: mainImageUpload.secure_url,
      image: imageUpload.secure_url, // Use the URL from Cloudinary
      restaurant: req.body.restaurant,
      rating: req.body.rating,
    });


    await food.save();
    res.json({ success: true, message: "Food added successfully" });
  } catch (error) {
    console.error("Error adding food:", error);
    res
      .status(500)
      .json({ success: false, message: "An error occurred while adding food" });
  }
};

const updateFood = async (req, res) => {
  try {
    let updateData = req.body;

    if (req.file) {
      if (req.files.mainImage) {
        const mainImageUpload = await cloudinaryInstance.uploader.upload(
          req.files.mainImage[0].path
        );
        updateData.mainImage = mainImageUpload.secure_url;
      }

      if (req.files.image) {
        const imageUpload = await cloudinaryInstance.uploader.upload(
          req.files.image[0].path
        );
        updateData.image = imageUpload.secure_url;
      }
    }

    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json({ success: true, data: updatedFood, message: "FOOD UPDATED" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "ERROR" });
  }
};

const deleteFood = async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "FOOD DELETED" });
  } catch {
    console.log(error);
    res.json({ success: false, message: "ERROR" });
  }
};

const getFoodById = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Food.findById(id);

    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found" });
    }

    res.json({ success: true, data: food });
  } catch (error) {
    console.error("Error fetching food:", error);
    res.status(500).json({ success: false, message: "An error occurred while fetching the food item" });
  }
};

module.exports = {
  addFood,
  getAllFood,
  updateFood,
  deleteFood,
  getFoodById
};
