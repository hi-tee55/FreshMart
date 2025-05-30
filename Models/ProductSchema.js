const mongoose = require('mongoose');
const Category = require('./CategoryModel');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: {type: String, required: true},
    richDescription: {type: String, default: ""},
    image: {type: String, default: ""},
    images: [
        {type: String}
    ],
    brand: {type: String, default: ""},
    price: {type: Number, default: 0},
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    image: { type: String, default: "" },
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true},
    isFeatured: { type: Boolean, default: false },
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    dateCreated: { type: Date, default: Date.now }
})

const Product = new mongoose.model("Product", ProductSchema);

module.exports = Product;
// This code defines a Mongoose schema for a product in an e-commerce application.