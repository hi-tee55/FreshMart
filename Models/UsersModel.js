const mongoose = require('mongoose');

const userIdSchema = new mongoose.Schema({
    name: {type: String, require: true},
    email: {type: String, require: true},
    password: {type: String, require: true},
    age: {type: Number, require: true},
    role: {type: String, enum: ['customer', 'admin'], default: 'customer'},
    address: {type: String, default: ""}
}, {timestamps: true});

const UserIdModel = new mongoose.model("UserId", userIdSchema);

module.exports = UserIdModel;