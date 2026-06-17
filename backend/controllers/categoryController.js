const Category = require("../models/Category");
const Recipe = require("../models/Recipe");

// Get All Categories with recipe counts
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    // Add real recipe counts
    const withCounts = await Promise.all(
      categories.map(async (cat) => {
        const count = await Recipe.countDocuments({ category: cat._id });
        return {
          ...cat.toObject(),
          recipeCount: count,
        };
      })
    );

    res.json(withCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name, image, description } = req.body;

    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name, image, description });

    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};