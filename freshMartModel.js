const mongoose = require("mongoose");

const userIdSchema = new mongoose.Schema({
    name: {type: String, require: true},
    email: {type: String, require: true},
    password: {type: String, require: true},
    age: {type: Number, require: true},
    role: {type: String, enum: ['customer', 'admin'], default: 'customer'},
    address: {type: String, default: ""}
}, {timestamps: true});

const UserId = new mongoose.model("UserId", userIdSchema);

const categoryNameSchema = new mongoose.Schema({
    category: {type: String, unique: true, require: true}
}, {timestamps: true});

// categoryNameSchema.index({ name: 1 }, { unique: true });

const CategoryName = new mongoose.model("CategoryName", categoryNameSchema);

const productName = new mongoose.Schema({
    product: {type: String, require: true},
    price: {type: Number, require: true},
    stock: {type: Number, require: true},
    category: {type: mongoose.Schema.Types.ObjectId, ref: "CategoryName"}
}, {timestamps: true})

const ProductName = new mongoose.model("ProductName", productName)

const orderSchema = new mongoose.Schema({
    orderItems: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "ProductName", require: true },
            quantity: { type: Number, require: true }
        }
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "UserId", require: true },
    totalPrice: { type: Number, require: true },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

const Order = new mongoose.model("Order", orderSchema);

const FreshMart = { UserId, CategoryName, ProductName, Order};

module.exports = FreshMart;

