const { getAllProducts, getOneProduct, addProduct, updateProduct, deleteProduct, getFeaturedProducts, getProductsCount, getProductsByCategory } = require("../Controllers/products");
const { authorization } = require("../Middleware/middle");

const express = require("express");

const router = express.Router();

router.get("/get-all-products", getAllProducts);
router.get("/get-one-product/:id", getOneProduct);

router.post("/add-product", authorization, addProduct);
router.patch("/update-product/:id", authorization, updateProduct);

router.delete("/delete-product/:id", authorization, deleteProduct);

router.get("/get-featured-products", getFeaturedProducts);
router.get("/get-products-count", getProductsCount);
router.get("/get-product-by-category/:categoryId", getProductsByCategory);

module.exports = router;