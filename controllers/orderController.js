const Order = require("../models/orderModel")

const createOrder = async(req,res)=>{
    try{
        const {user,order, totalAmount} = req.body
        const newOrder = new Order({
            user,
            order,
            totalAmount
        })
        await newOrder.save()
        res.status(201).json({ message: 'Order created successfully', newOrder });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
    }
};


const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user').populate('order.food');
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve order' });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete order' });
    }
};

module.exports = { createOrder, getOrder, deleteOrder };

