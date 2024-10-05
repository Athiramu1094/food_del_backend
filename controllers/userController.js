const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

const createToken = (userId) => {
  return jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });

    // Save the user to the database
    const user = await newUser.save();

    const token = createToken(user._id);
    res.cookie("token", token, { httpOnly: true });

    res
      .status(201)
      .json({ success: true, message: "Signup and login successful", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    const token = createToken(user._id);
    //res.cookie("token", token);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    });
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender, 
        dob: user.dob,    
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");

    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const userProfile = async (req, res, next) => {
  try {
    const { id } = req.params; // Get the user ID from the request parameters
    const useData = await User.findById(id).select("-password"); // Fetch user data by ID, exclude the password

    res.json({ 
      success: true, 
      message: "user data fetched", 
      data: useData // Return the user data in the response
    });
  } catch (error) {
    res.status(error.status || 500).json({ 
      message: error.message || "Internal server error" 
    });
  }
};


const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, gender, dob } = req.body;

    // Update user data in the database
    const updatedUser = await User.findByIdAndUpdate(id, { name, gender, dob }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};




const checkUser = async (req, res, next) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res
        .status(200)
        .json({ success: true, message: "user not authenticated" });
    }
    
    // res.json({ success: true, message: "User authenticated", });
    res.json({ success: true, message: "User authenticated", user: req.user });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  userProfile,
  checkUser,
  updateUserProfile
};
