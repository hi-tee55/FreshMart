const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const FreshMart = require("./freshMartModel");
const { sendMail, validEmail } = require("./sendForgotPasswordMail");
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


app.post("/sign-up", async (req, res) => {
    const { name, email, password, age, role, address } = req.body;

    try {
        if (!name || !email || !password || !age || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!validEmail(email)) {
            return res.status(400).json({ message: "Invalid email address!!!"})
        }

        const existingUser = await FreshMart.UserId.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!"});
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        if (age < 18) {
            return res.status(400).json({ message: "You must be at least 18 years old to register" });
        }

        const hashedPassword =  await bcrypt.hash(password, 12);

        const newUser = new FreshMart.UserId({
            name,
            email,
            password: hashedPassword,
            age,
            role,
            address
        });
        const savedUser = await newUser.save();

        res.status(201).json({ 
            message: "User registered successfully!",
            savedUser: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                age: savedUser.age,
                role: savedUser.role,
                address: savedUser.address
            }
        });
    } catch (error) {
        console.error("Error during sign-up:", error);
        res.status(500).json({
            message: error.message
        });
    }
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await FreshMart.UserId.findOne({ email });
    try {
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }

        const isMatch = await bcrypt.compare(password, user?.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        //generate token
        const accessToken = jwt.sign(
            {id: user?._id},
            process.env.ACCESS_TOKEN,
            {expiresIn: "15min"}
        )

        res.status(200).json({
            message: "Login successful",
            accessToken,
            user: {
                name: user?.name,
                role: user?.role
            }
        })
    }
    catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})


app.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    const user = await FreshMart.UserId.findOne({ email });
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    await sendMail(email, "");

    res.status(200).json({
        message: "Password reset link sent to your email"
    })
})

app.patch("/reset-password", async (req, res) => {
    const { email, password } = req.body;

    const user = await FreshMart.UserId.findOne({ email });

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }
    if (password.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters long"
        })
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
        message: "Password reset successfully"
    })
})

