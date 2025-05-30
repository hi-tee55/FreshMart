const Category = require("../Models/CategoryModel");
const Product = require("../Models/ProductSchema");




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
            return res.status(400).json({ message: "Invalid category ID format" });
        }

        const product = await Product.findById(req.params.id);

        if (!category) {
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
    const { category } = req.body;
    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
        return res.status(400).json({ message: "Invalid category." });
    }
    const { name, description, richDescription, image, images, brand, price, stock, isFeatured } = req.body;

    const product = Product({
        name,
        description,
        richDescription,
        image,
        images,
        brand,
        price,
        stock,
        category,
        isFeatured
    });

    
}