const Coupon = require('../models/couponModel'); 

// Create a new coupon
const createCoupon = async (req, res) => {
    const { code, discountType, discountValue, expiryDate } = req.body;
    try {
        const newCoupon = new Coupon({ code, discountType, discountValue, expiryDate });
        await newCoupon.save();
        res.status(201).json({ success: true, message: 'Coupon created' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error creating coupon' });
    }
};

// Apply a coupon (check and calculate discount)
const applyCoupon = async (req, res) => {
    const { code, totalPrice } = req.body; // Expect totalPrice in the request
    try {
        const coupon = await Coupon.findOne({ code, isActive: true, expiryDate: { $gt: new Date() } });
        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found or expired' });
        }

        let discount = 0;

        // Apply discount rules based on totalPrice
        if (totalPrice > 500) {
            discount = totalPrice * 0.25; // 25% discount for prices above 500
        } else if (totalPrice > 200) {
            discount = totalPrice * 0.10; // 10% discount for prices above 200
        }

        // Adjust the totalPrice after applying the discount
        const finalPrice = totalPrice - discount;

        res.status(200).json({
            success: true,
            discount,
            finalPrice,
            message: `Coupon applied. ${discount > 0 ? 'Discount applied.' : 'No discount available.'}`
        });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error applying coupon' });
    }
};

// Get coupon by code
const getCouponByCode = async (req, res) => {
    const { code } = req.params;
    try {
        const coupon = await Coupon.findOne({ code, isActive: true, expiryDate: { $gt: new Date() } });
        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found or expired' });
        }
        res.status(200).json({ success: true, coupon });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error validating coupon' });
    }
};

module.exports = {
    createCoupon,
    applyCoupon,
    getCouponByCode
};
