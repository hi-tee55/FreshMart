const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/UsersModel");
const { validEmail, sendMail } = require("../sendForgotPasswordMail");

const userSignUp = async (req, res) => {
    const { name, email, password, age, role, address } = req.body;
    
    try {
        if (!name || !email || !password || !age || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!validEmail(email)) {
            return res.status(400).json({ message: "Invalid email address!!!"})
        }

        const existingUser = await User.findOne({ email });

        // Check if the user already exists
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists!" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        if (age < 18) {
            return res.status(400).json({ message: "You must be at least 18 years old to register" });
        }

        const hashedPassword =  await bcrypt.hash(password, 12);

        const newUser = User({
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
}

const userLogin = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

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
            {expiresIn: "5h"}
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
        res.status(500).json({
            message: error.message
        });
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    try {
        if (!user) {
            return res.status(404).json({
                message: "User not found"
        })
    }

        await sendMail(email, "");

        res.status(200).json({
            message: "Password reset link sent to your email"
        })
    } catch (error) {
        console.log(error)
    }
}

const resetUserPassword = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    try {
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            message: "Password reset successfully"
        })
    } catch (error) {
        console.error("Error during password reset:", error);
        res.status(500).json({
            message: error.message
        });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password -__v");
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        res.status(200).json({
            message: "Users retrieved successfully",
            users
        });
    } catch (error) {
        console.error("Error retrieving users:", error);
        res.status(500).json({
            message: error.message
        });
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({
            message: error.message
        });
    }
}

const getOneUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id).select("-password -__v");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User retrieved successfully",
            user
        });
    } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    userSignUp,
    userLogin,
    forgotPassword,
    resetUserPassword,
    getAllUsers,
    deleteUser,
    getOneUser
}
