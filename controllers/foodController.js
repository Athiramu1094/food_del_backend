const { cloudinaryInstance } = require("../config/cloudinaryConfig.js");
const Food = require("../models/foodModel.js");

const getAllFood = async (req, res) => {
  try {
    const foods = await Food.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log("error");
    res.json({ success: false, message: "ERROR" });
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

module.exports = {
  addFood,
  getAllFood,
  updateFood,
  deleteFood,
};
