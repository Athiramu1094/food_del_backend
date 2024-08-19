const { cloudinaryInstance } = require("../config/cloudinaryConfig.js");
const Restaurant = require("../models/restaurantModel.js");

const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    res.json({ success: true, data: restaurants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "ERROR" });
  }
};

const addRestaurant = async (req, res) => {
  

  // Upload an image
  const uploadResult = await cloudinaryInstance.uploader
    .upload(req.file.path)
    .catch((error) => {
      console.error(error);
    });
  console.log(uploadResult);

  const restaurant = new Restaurant({
    name: req.body.name,
    address: req.body.address,
    phone: req.body.phone,
    email: req.body.email,
    cuisine: req.body.cuisine,
    description: req.body.description,
    image: uploadResult.secure_url,
  });

  try {
    await restaurant.save();
    res.json({ success: true, message: "RESTAURANT ADDED" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "ERROR" });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    let updateData = req.body;

    if (req.file) {
      const uploadResult = await cloudinaryInstance.uploader.upload(
        req.file.path
      );
      updateData.image = uploadResult.secure_url;
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json({
      success: true,
      data: updatedRestaurant,
      message: "RESTAURANT UPDATED",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "ERROR" });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    await Restaurant.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "RESTAURANT DELETED" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "ERROR" });
  }
};

module.exports = {
  addRestaurant,
  getAllRestaurants,
  updateRestaurant,
  deleteRestaurant,
};
