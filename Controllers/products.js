const Category = require("../Models/CategoryModel");
const Product = require("../Models/ProductSchema");
const mongoose = require("mongoose");


const getAllProducts = async (req, res) => {
    try{
        const productsList = await Product.find().populate("category");

        if (!productsList) {
            res.status(400).json({success: false})
        }

        res.status(200).json({
            message: "Successful",
            productsList
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            message: "An error occurred while retrieving the products.",
            error: error.message
        });
    }
}

const getOneProduct = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid product ID format" });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(400).json({
                message: "Product not found."
            })
        }

        res.status(200).json({
            message: "successful",
            product
        })
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({
            message: "An error occurred while retrieving the product.",
            error: error.message
        });
    }
}

const addProduct = async (req, res) => {
    try {
        let { category } = req.body;
        // Find category by name instead of ID
        category = await Category.findOne({ name: category });

        if (!category) {
            category = new Category({ name: req.body.category });
            await category.save();
        }
        const { name, description, richDescription, image, images, brand, price, stock, isFeatured } = req.body;

        const existingProduct = await Product.findOne({ name, category: category._id });
        if (existingProduct) {
            return res.status(400).json({ message: "Product already exists in this category." });
        }

        const product = Product({
            name,
            description,
            richDescription,
            image,
            images,
            brand,
            price,
            stock,
            category: category._id,
            isFeatured
        });

        await product.save();
        res.status(201).json({
            message: "Product created successfully.",
            product
        });
    } catch (error) {
        console.error("Error uploading product:", error);
        res.status(500).json({
            message: "An error occurred while uploading the product.",
            error: error.message
        });
    }
}

const updateProduct = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid product ID format" });
        }

        const { category } = req.body;
        category = await Category.findById(category);

        const { name, description, richDescription, image, images, brand, price, stock, isFeatured } = req.body;
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                richDescription,
                image,
                images,
                brand,
                price,
                stock,
                category: category.id,
                isFeatured
            },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        await product.save();
        res.status(200).json({
            message: "Product updated successfully.",
            product
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({
            message: "An error occurred while updating the product.",
            error: error.message
        });
    }
}

const deleteProduct = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid product ID format" });
        }

        const product = await Product.findByIdAndRemove(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({
            message: "An error occurred while deleting the product.",
            error: error.message
        });
    }
}

const getFeaturedProducts = async (req, res) => {
    try {
        const count = req.query.count ? parseInt(req.query.count) : 0;
        const featuredProducts = count > 0
            ? await Product.find({ isFeatured: true }).limit(count)
            : await Product.find({ isFeatured: true });

        res.status(200).json({
            message: "Featured products retrieved successfully.",
            featuredProducts
        });
    } catch (error) {
        console.error("Error fetching featured products:", error);
        res.status(500).json({
            message: "An error occurred while retrieving featured products.",
            error: error.message
        });
    }
};

const getProductsCount = async (req, res) => {
    try {
        const productCount = await Product.countDocuments();
        res.status(200).json({ productCount });
    } catch (error) {
        console.error("Error counting products:", error);
        res.status(500).json({
            message: "An error occurred while counting products.",
            error: error.message
        });
    }
};

const getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ message: "Invalid category ID format" });
        }

        const products = await Product.find({ category: categoryId }).populate("category");
        res.status(200).json({
            message: "Products by category retrieved successfully.",
            products
        });
    } catch (error) {
        console.error("Error fetching products by category:", error);
        res.status(500).json({
            message: "An error occurred while retrieving products by category.",
            error: error.message
        });
    }
};

module.exports = {
    getAllProducts,
    getOneProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
    getProductsCount,
    getProductsByCategory
};

// const createCategoryIfNotExist = async (categoryName) => {
//     let category = await Category.findOne({ name: categoryName });
//     if (!category) {
//         category = new Category({ name: categoryName });
//         await category.save();
//     }
//     return category;
// };