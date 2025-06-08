const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    icon: {type: String, default: ""},
    color: {type: String, default: "blue"}
}, { timestamps: true });

const Category = new mongoose.model("Category", CategorySchema);

module.exports = Category;