const mongoose = require('mongoose');
const Product = require('./ProductSchema');

const OrderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

const OrderItem = new mongoose.model('OrderItem', OrderItemSchema);
module.exports = OrderItem;