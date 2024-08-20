const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController');

router.post('/', createOrder); 
router.get('/', getAllOrders); 
router.get('/:orderId', getOrderById); 
router.put('/status', updateOrderStatus); 

module.exports = router;
