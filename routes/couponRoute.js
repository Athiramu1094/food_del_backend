const express = require("express");
const router = express.Router();

// Import the coupon controller methods
const {
  createCoupon,
  applyCoupon,
  getCouponByCode,
} = require("../controllers/couponController");

// Route to create a new coupon
router.post("/", createCoupon);

// Route to apply a coupon based on the total price
router.post("/apply", applyCoupon);

// Route to get a coupon by its code
router.get("/:code", getCouponByCode);

module.exports = router;
