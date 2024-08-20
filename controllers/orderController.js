const User = require('../models/userModel'); 
const Restaurant = require('../models/restaurantModel'); 
const Food = require('../models/foodModel'); 
const Order = require("../models/orderModel");


const calculateTotalPrice = (items) => {
  return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
};


const createOrder = async (req, res, next) => {
  try {
    const { userId, restaurantId, items } = req.body;

   
    const user = await User.findById(userId);
    const restaurant = await Restaurant.findById(restaurantId);
    if (!user || !restaurant) {
      return res.status(400).json({ message: 'Invalid user or restaurant' });
    }

    // Validate food existence and calculate price for each item
    const validatedItems = [];
    for (const item of items) {
      const food = await Food.findById(item.foodId);
      if (!food) {
        return res.status(400).json({ message: 'Invalid food item' });
      }
      validatedItems.push({
        food: item.foodId,
        quantity: item.quantity || 1, // Set default quantity to 1 if not provided
        price: food.price,
      });
    }

    // Calculate total price
    const totalPrice = calculateTotalPrice(validatedItems);

    // Create a new order
    const order = new Order({
      user: userId,
      restaurant: restaurantId,
      items: validatedItems,
      totalPrice,
      status: 'pending', // Set initial status to pending
    });

   
    await order.save();

    return res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'name').populate('restaurant', 'name'); 
    return res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('user', 'name').populate('restaurant', 'name');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.status(200).json({ order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId, status } = req.body;

    
    if (!['pending', 'accepted', 'rejected', 'delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true }); 

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createOrder, getAllOrders, getOrderById, updateOrderStatus };
