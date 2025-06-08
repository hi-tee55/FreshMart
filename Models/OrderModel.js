const mongoose = require('mongoose');
const {OrderItem} = require('./orderItem'); // Assuming orderItem.js exports OrderItem model

const OrderSchema = new mongoose.Schema({
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        required: true
    }],
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'UserId', required: true},
    totalPrice: { type: Number, require: true },
    zip: {type: String, required: true},
    country: {type: String, required: true},
    city: {type: String, required: true},
    address: { type: String, required: true },
    status: { type: String, default: 'pending' }
}, { timestamps: true });

const Order = new mongoose.model('Order', OrderSchema);

module.exports = Order;
// This code defines a Mongoose schema for an order in an e-commerce application.
///