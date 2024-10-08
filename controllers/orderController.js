const User = require("../models/userModel");
const Restaurant = require("../models/restaurantModel");
const Food = require("../models/foodModel");
const Order = require("../models/orderModel");


const calculateTotalPrice = (items) => {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
};


const createOrder = async (req, res, next) => {
  try {
    const { userId, restaurantId, items, address } = req.body;
    
   
    if (!userId || !restaurantId || !address) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Items array is required and cannot be empty" });
    }
    
    const user = await User.findById(req.body.userId);
    
    
    const restaurant = await Restaurant.findById(restaurantId);
  
    if (!user || !restaurant) {
      return res.status(400).json({ message: "Invalid user or restaurant" });
    }

    const validatedItems = [];
    let totalAmount = 0;

    for (const item of items) {
      
      if (!item._id || item.quantity <= 0) {
        return res
          .status(400)
          .json({ message: `Invalid item: ${JSON.stringify(item)}` });
      }
      
      const food = await Food.findById(item._id);
      
      if (!food) {
        return res
          .status(400)
          .json({ message: `Invalid food item with ID: ${item._id}` });
      }
      const itemAmount = food.price * (item.quantity || 1);
    
      totalAmount += itemAmount;

      validatedItems.push({
        food: item._id,
        quantity: item.quantity || 1,
      });
    }

    const order = new Order({
      user: userId,
      restaurant: restaurantId,
      order: validatedItems,
      totalAmount,
      status: "Pending", // Default status
      paymentStatus: "Pending", // Default payment status
      address,
    });
    
    await order.save();
    await order.populate("order.food")
    
    return res
      .status(201)
      .json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const getAllOrders = async (req, res) => {
  try {
    const { userId } = req.query;

   
    const orders = await Order.find({ user: userId })
      .populate({
        path: 'order.food',  
        select: 'name price image' 
      })
      .populate('restaurant', 'name image'); 

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};





const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate("user", "name")
      .populate("restaurant", "name");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId, status } = req.body;

    if (!["pending", "accepted", "rejected", "delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createOrder, getAllOrders, getOrderById, updateOrderStatus };
