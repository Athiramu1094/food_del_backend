const express = require("express");
const router = express.Router();
const {
  signupAdmin,
  loginAdmin,
  logoutAdmin,
  adminProfile,
  checkAdmin,
} = require("../controllers/adminController");
const authAdmin = require("../middlewares/authAdmin");

router.post("/admin/signup", signupAdmin);
router.post("/admin/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.get("/profile/:id", authAdmin, adminProfile);
router.get("/api/check", authAdmin, checkAdmin);

module.exports = router;
