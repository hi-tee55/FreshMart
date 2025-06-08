
const express = require("express");
const { getAllCategories, findOneCategory, addCategory, updateCategory, deleteCategory } = require("../Controllers/category");
const { authorization } = require("../Middleware/middle");


const router = express.Router();

router.get("/get-all-categories", getAllCategories);
//router.get("/find-one-category", findOneCategory);
router.get("/find-one-category/:id", findOneCategory);

router.post("/add-category", authorization, addCategory);
router.patch("/update-category/:id", authorization, updateCategory);

router.delete("/delete-category/:id", authorization, deleteCategory);

module.exports = router;