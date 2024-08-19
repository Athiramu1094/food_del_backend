const express = require('express');
const router = express.Router();
const { processPayment, getPaymentStatus } = require('../controllers/paymentController');

router.post('/', processPayment);  
router.get('/:id', getPaymentStatus); 

module.exports = router;
