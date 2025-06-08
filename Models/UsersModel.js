const mongoose = require('mongoose');

const userIdSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    age: {type: Number, required: true},
    role: {type: String, default: 'customer'},
    address: {type: String, default: ""}
}, {timestamps: true});

const User = new mongoose.model("User", userIdSchema);

module.exports = User;