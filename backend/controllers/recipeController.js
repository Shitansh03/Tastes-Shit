const Category = require("../models/Category");
const Recipe = require("../models/Recipe");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// Create Recipe
exports.createRecipe = async (req, res) => {
  try {
    const {
      title,
      description,
      ingredients,
      instructions,
      category,
      cookingTime,
      difficulty,
      servings,
      calories,
    } = req.body;

    if (!req.files?.image) {
      return res.status(400).json({ message: "Recipe image is required" });
    }

    // IMAGE UPLOAD — auto compressed (Sharp → WebP)
    const imageResult = await uploadToCloudinary(
      req.files.image[0].buffer,
      "recipes/images"
      // type defaults to "image"
    );
    const imageUrl = imageResult.secure_url;

    // VIDEO UPLOAD — auto compressed (ffmpeg → H.264 MP4)
    let videoUrl = "";
    if (req.files?.video) {
      const videoResult = await uploadToCloudinary(
        req.files.video[0].buffer,
        "recipes/videos",
        "video" // <-- important: tells utility to use ffmpeg pipeline
      );
      videoUrl = videoResult.secure_url;
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const parsedIngredients = Array.isArray(ingredients) ? ingredients : [ingredients];
    const parsedInstructions = Array.isArray(instructions) ? instructions : [instructions];

    const recipe = await Recipe.create({
      title,
      description,
      ingredients: parsedIngredients.filter(Boolean),
      instructions: parsedInstructions.filter(Boolean),
      category,
      cookingTime: Number(cookingTime),
      difficulty: difficulty || "Medium",
      servings: Number(servings) || 4,
      calories: Number(calories) || 0,
      image: imageUrl,
      video: videoUrl,
      createdBy: req.user.id,
      isSystemRecipe: false,
    });

    await Category.findByIdAndUpdate(category, { $inc: { recipeCount: 1 } });

    const populated = await Recipe.findById(recipe._id)
      .populate("createdBy", "username avatar")
      .populate("category", "name image");

    res.status(201).json({ success: true, recipe: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Recipes
exports.getRecipes = async (req, res) => {
  try {
    const { category, search, sort } = req.query;

    let filter = {};

    if (category && category !== "All") {
      const foundCategory = await Category.findOne({ name: category });
      if (!foundCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
      filter.category = foundCategory._id;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === "rating") sortOption = { averageRating: -1 };
    if (sort === "time") sortOption = { cookingTime: 1 };

    const recipes = await Recipe.find(filter)
      .populate("createdBy", "username avatar")
      .populate("category", "name image")
      .sort(sortOption);

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Recipe
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate("createdBy", "username avatar bio")
      .populate("category", "name image")
      .populate("reviews.user", "username avatar");

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Recipe
exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (!recipe.createdBy || recipe.createdBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this recipe" });
    }

    if (req.body.category) {
      const categoryExists = await Category.findById(req.body.category);
      if (!categoryExists) {
        return res.status(400).json({ message: "Invalid category" });
      }
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
      .populate("createdBy", "username avatar")
      .populate("category", "name image");

    res.json({ success: true, recipe: updatedRecipe });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Recipe
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (!recipe.createdBy || recipe.createdBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this recipe" });
    }

    await recipe.deleteOne();

    await Category.findByIdAndUpdate(recipe.category, {
      $inc: { recipeCount: -1 },
    });

    res.json({ success: true, message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Review
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const alreadyReviewed = recipe.reviews.find(
      (r) => r.user.toString() === req.user.id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "You already reviewed this recipe" });
    }

    recipe.reviews.push({ user: req.user.id, rating, comment });
    recipe.calculateAverageRating();
    await recipe.save();

    const updated = await Recipe.findById(req.params.id)
      .populate("reviews.user", "username avatar");

    res.status(201).json({ success: true, recipe: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get My Recipes
exports.getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ createdBy: req.user.id })
      .populate("category", "name image")
      .sort({ createdAt: -1 });

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
