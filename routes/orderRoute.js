const express = require('express');
const router = express.Router();
const { createOrder, getOrder, deleteOrder } = require('../controllers/orderController');


router.post('/', createOrder); 
router.get('/:id', getOrder); 
router.delete('/:id', deleteOrder);

module.exports = router;    