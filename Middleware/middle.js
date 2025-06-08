const jwt = require("jsonwebtoken");
const User = require("../Models/UsersModel");

const validateRegister = (req, res, next) => {
    const { name, email, password, age, role, address } = req.body;

    const errors = [];

    if (!email) {
        errors.push("Please provide a valid email address")
    }

    if (!password || password.length < 6) {
        errors.push("Password must be at least 6 characters long");
    }
    
    if (errors.length > 0) {
        return res.status(400).json({
            message: errors.join(", ")
        })
    }

    next()
}

const authorization = async (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization token missing or malformed" });
    }

    const realToken = authHeader.split(" ")[1];
    console.log(realToken);
    if (!realToken) {
        return res.status(401).json({ message: "Authorization token missing" });
    }   

    try {
        const decoded = jwt.verify(realToken, process.env.ACCESS_TOKEN);
        if (!decoded) {
            return res.status(401).json({ message: "Invalid or expired token. Please login" });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "User not found. Please login" });
        }
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token. Please login" });
    }
}
module.exports = {
    validateRegister,
    authorization
}