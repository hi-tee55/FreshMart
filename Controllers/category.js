const Category = require("../Models/CategoryModel");
const mongoose = require("mongoose");



const getAllCategories = async (req, res) => {
    const categoryList = await Category.find();

    if (!categoryList) {
        res.status(500).json({success: false})
    }
    res.status(200).json({
        success: true,
        categoryList
    });
}

const findOneCategory = async (req, res) => {
    try {
        // if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        //     return res.status(400).json({ message: "Invalid category ID format" });
        // }

        const categoryId  = req.params.id;
        // Replace the following line with your actual logic to find a category by ID
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({
            message: "successful",
            category
        })
    } catch (error) {
        console.error("Error finding category:", error);
        res.status(500).json({
            message: "An error occurred while retrieving the category.",
            error: error.message
        });
    }
};

// ...other code...

// Make sure the function uses req.params.id to get the category ID
// const findOneCategory = async (req, res) => {
//     try {
//         const categoryId = req.params.id;
//         if (!categoryId) {
//             return res.status(400).json({ message: "Category ID is required" });
//         }
//         const category = await CategoryModel.findById(categoryId);
//         if (!category) {
//             return res.status(404).json({ message: "Category not found" });
//         }
//         res.status(200).json(category);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

const addCategory = async (req, res) => {
    try {
        const { name, icon, color } = req.body;

        const category = Category({
        name,
        icon,
        color
    })

        if (!category) {
            return res.status(404).send("the category must be created!")
        }
        const existingCategory = await Category.findOne({ name });

        if (existingCategory) {
            return res.status(400).json({ message: "Category already exists" });
        }

        await category.save();
        res.send(category);
    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({
            message: "An error occurred while adding the category.",
            error: error.message
        });
    }   
}

const updateCategory = async (req, res) => {
    const { name, icon, color } = req.body;
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name,
            icon,
            color
        },
        { new: true }
    );
    if (!category) {
        return res.status(404).send("the category cannot be found!");
    }

    await category.save();
    res.status(200).json({
        message: "Category updated successfully",
        category
    });
}

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndRemove(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Category successfully deleted"
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = {
    getAllCategories,
    findOneCategory,
    addCategory,
    updateCategory,
    deleteCategory
}