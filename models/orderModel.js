const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    order:[
        {
            food:{type:mongoose.Schema.Types.ObjectId, ref:'Food', required:true},
            quantity:{type:Number, required:true}
        }
    ],
    totalAmount: { type: Number, required: true },
    status:{type:String, enum:['Pending', 'Processing', 'Completed', 'Cancelled'], default: 'Pending' },
    paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
})

const Order= mongoose.model('Order', orderSchema);

module.exports = Order;
