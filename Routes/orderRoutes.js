const express = require("express");
const { getAllOrders, getOneOrder, addOrder, updateOrder, deleteOrder, getTotalSales, getOrderCount } = require("../Controllers/Orders");
const { authorization } = require("../Middleware/middle");

const router = express.Router();

router.get("/get-all-orders", getAllOrders);
router.get("/get-one-order", getOneOrder);
router.get("/get-total-sales", authorization, getTotalSales);
router.get("/get-order-count", authorization, getOrderCount);

router.post("/add-order", addOrder);

router.patch("/update-order", updateOrder);

router.delete("/remove-order", deleteOrder);

module.exports = router;
