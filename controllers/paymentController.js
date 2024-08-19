const Payment = require('../models/paymentModel');
const Order = require('../models/orderModel');


const processPayment = async (req, res) => {
    try {
        const { orderId, amount, paymentMethod } = req.body;

        
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        const transactionId = 'txn_' + Date.now(); // Generate a mock transaction ID
        const paymentStatus = 'completed';

        const newPayment = new Payment({
            orderId,
            amount,
            status: paymentStatus,
            transactionId,
            paymentMethod
        });

        await newPayment.save();
        res.status(201).json({ message: 'Payment processed successfully', newPayment });
    } catch (error) {
        res.status(500).json({ error: 'Failed to process payment' });
    }
};


const getPaymentStatus = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) return res.status(404).json({ error: 'Payment not found' });
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve payment status' });
    }
};

module.exports = { processPayment, getPaymentStatus };
