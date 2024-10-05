const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const validator = require("validator");

// Function to create a JWT token
const createToken = (userId, role) => {
  return jwt.sign({ _id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};

// Admin signup
const signupAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("Admin Signup:", { name, email, password }); // Log request body

    // Check if admin already exists
    const exists = await User.findOne({ email, role: "admin" });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "Admin already exists" });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email" });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    const newAdmin = new User({
      name: name,
      email: email,
      password: hashedPassword,
      role: "admin",
    });

    const admin = await newAdmin.save();
    console.log("Admin Created:", admin); // Log newly created admin

    const token = createToken(admin._id, admin.role);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.status(201).json({ success: true, message: "Signup successful" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the admin exists
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin does not exist" });
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    // Generate token using a function (ensure you have this function)
    const token = createToken(admin._id, admin.role); // Make sure createToken is defined elsewhere
    // Set the token in an HttpOnly cookie (optional, but useful for security)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });
    // Return response with the token and user info
    res.status(200).json({
      success: true,
      message: "Login successful",
      token: token, // Use the generated token instead of a placeholder
      user: { _id: admin._id, email: admin.email },
    });
  } catch (error) {
    console.error("Login error:", error); // Improved error logging
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Admin logout
const logoutAdmin = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });
    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Fetch admin profile
const adminProfile = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. Admins only." });
    }

    const { id } = req.params;
    const adminData = await User.findById(id).select("-password");

    if (!adminData) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    res.json({ success: true, message: "Admin data fetched", data: adminData });
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// Check if the user is admin
const checkAdmin = async (req, res) => {
  console.log("Request Headers:", req.headers);
  console.log("Request Cookies:", req.cookies);
  try {
    const user = req.user; // Assuming req.user is set by your auth middleware
    console.log("Received request to check user status:", user);
    // Make sure to check the user's role
    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Admin authentication required" });
    }

    // Respond with user information if authenticated
    res.json({
      success: true,
      user: { _id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Check Admin Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  signupAdmin,
  loginAdmin,
  logoutAdmin,
  adminProfile,
  checkAdmin,
};
