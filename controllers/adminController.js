const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const validator = require('validator');


const createToken = (userId) => {
    return jwt.sign({ _id: userId, role: 'admin' },process.env.JWT_SECRET , { expiresIn: '3d' });
};


    const signupAdmin = async (req, res) => {
        try {
        const { name, email, password } = req.body;

        
        const exists = await User.findOne({ email, role: 'admin' });
        if (exists) {
            return res.status(400).json({ success: false, message: "Admin already exists" });
        }

        
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
        }

        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        
        const newAdmin = new User({
            name: name,
            email: email,
            password: hashedPassword,
            role: 'admin'
        });

        const admin = await newAdmin.save();
        const token = createToken(admin._id);
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }); 
        res.status(201).json({ success: true, message: "Login successful"});

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        
        const admin = await User.findOne({ email, role: 'admin' });
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin does not exist" });
        }

    
        const isPasswordMatch = await bcrypt.compare(password, admin.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }

        
        const token = createToken(admin._id);
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production'}); 
        res.status(200).json({ success: true, message: "Login successful" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


const logoutAdmin = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


const adminProfile = async (req, res, next) => {
    try {
        
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Access denied. Admins only." });
        }

        const { id } = req.params;
        
        const adminData = await User.findById(id).select("-password");

        if (!adminData) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        res.json({ success: true, message: "Admin data fetched", data: adminData });
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message || "Internal server error" });
    }
};


const checkAdmin = async (req, res) => {
    try {
        const user = req.user;

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Admin authentication required" });
        }

        res.json({ success: true, message: "Admin authenticated" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    signupAdmin,
    loginAdmin,
    logoutAdmin,
    adminProfile,
    checkAdmin
};
