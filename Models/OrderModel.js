const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderItems: {
        product: {},
        quantity: { type: Number, required: true }
    },
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'UserId', required: true},
    totalPrice: { type: Number, require: true },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

const OrderModel = new mongoose.model("Order", OrderSchema);

module.exports = OrderModel;
// This code defines a Mongoose schema for an order in an e-commerce application.