const mongoose = require("mongoose");
const Order = require("../Models/OrderModel");
const OrderItem = require("../Models/orderItem");

const getAllOrders = async (req, res) => {
    try {
        const ordersList = await Order.find();

        if (!ordersList) {
            return res.status(500).json({ success: false });
        }

        res.status(200).json({
            message: "successful",
            ordersList
        })
    } catch (error) {
        console.error("Error finding orders:", error);
        res.status(500).json({
            message: "An error occurred while retrieving orders.",
            error: error.message
        });
    }
}

const getOneOrder = async (req, res) => {
    try{
        const order = await Order.findById(req.params.id).populate("user", "name");

        if (!order) {
            return res.status(500).json({success: false})
        }
        res.status(200).json({
            success: true,
            order
        })
    } catch (error) {
        console.error("Error finding order:", error);
        res.status(500).json({
            message: "An error occurred while retrieving the order.",
            error: error.message
        });
    }
}

const addOrder = async (req, res) => {
    const orderItemsId = Promise.all(req.body.orderItems.map(async (item) => {
        let newOrderItem = OrderItem({
            quantity: item.quantity,
            product: item.product
        })

        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
    }));

    const orderItemsResolved = await orderItemsId;
    const { orderItems, user, totalPrice, zip, country, city, address, status } = req.body;

    const order = Order({
        orderItems: orderItemsResolved,
        user,
        totalPrice,
        zip,
        country,
        city,
        address,
        status
    });

    if (!order) {
        return res.status(500).json({ success: false });
    }
    try {
        await order.save();
    } catch (error) {
        console.error("Error saving order:", error);
        return res.status(500).json({
            message: "An error occurred while saving the order.",
            error: error.message
        });
    }
    // await order.save();
    res.status(200).json({
        success: true,
        order
    })
}


const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndRemove(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Remove all associated order items
        await Promise.all(
            order.orderItems.map(async (orderItemId) => {
                await OrderItem.findByIdAndRemove(orderItemId);
            })
        );

        res.status(200).json({ success: true, message: "Order deleted successfully" });
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the order.",
            error: error.message
        });
    }
}

const updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while updating the order.",
            error: error.message
        });
    }
}


// Get total sales
const getTotalSales = async (req, res) => {
    try {
        const totalSales = await Order.aggregate([
            { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } }
        ]);
        if (!totalSales || totalSales.length === 0) {
            return res.status(400).json({ success: false, message: "No sales found" });
        }
        res.status(200).json({ success: true, totalSales: totalSales[0].totalSales });
    } catch (error) {
        console.error("Error calculating total sales:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while calculating total sales.",
            error: error.message
        });
    }
};

// Get order count
const getOrderCount = async (req, res) => {
    try {
        const orderCount = await Order.countDocuments();
        res.status(200).json({ success: true, orderCount });
    } catch (error) {
        console.error("Error getting order count:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while getting order count.",
            error: error.message
        });
    }
};


const getUserOrder = async (req, res) => {
    try {
        const user = req.params.id;

        const order = await Order.find(user).populate("orderItems");

        if (!order) {
            res.status(400).json({
                success: false,
                message: "Order not found"
            })
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error("Error getting order:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while getting the order.",
            error: error.message
        });
    }
}

module.exports = {
    getAllOrders,
    getOneOrder,
    addOrder,
    deleteOrder,
    updateOrder,
    getTotalSales,
    getOrderCount,
    getUserOrder
};