const express = require("express");
const { createCheckoutSession, getSessionStatus } = require("../controllers/paymentController");
const  authUser  = require("../middlewares/authUser.js");

const router = express.Router();



router.post("/create-checkout-session", authUser, createCheckoutSession);


router.get("/session-status", authUser, getSessionStatus);

module.exports = router;
