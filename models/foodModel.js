const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: {type:String, required:true}, 
    description: {type:String, required:true}, 
    price: {type:Number, required:true}, 
    image: {type:String, required:true}, 
    category:{type:String, required:true},
    restaurant: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Restaurant', 
        required: true 
    }
});

const Food = mongoose.model('Food', foodSchema);

module.exports = Food