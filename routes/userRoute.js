const express = require('express');
const router = express.Router();
const { createUser, loginUser, logoutUser, userProfile, checkUser } = require("../controllers/userController");
const authUser = require("../middlewares/authUser")

router.post("/create", createUser);
router.post("/login", loginUser);
router.post('/logout', logoutUser);
router.get('/profile/:id', userProfile);
router.get("/checkUser", authUser, checkUser);

module.exports = router;
