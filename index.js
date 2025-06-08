const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const routes = require("./Routes");
dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log("mongodb connected successfully...")
    app.listen(PORT, () => {
        console.log(`port is listening at ${PORT}`)
    })
})

// Handle errors for database connection
mongoose.connection.on("error", (err) => {
    console.error("Database connection error:", err);
});

app.use(routes);