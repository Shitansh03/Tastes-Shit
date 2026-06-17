const express = require("express");
const {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  addReview,
  getMyRecipes,
} = require("../controllers/recipeController");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", getRecipes);
router.get("/my-recipes", protect, getMyRecipes);
router.get("/:id", getRecipeById);

router.post(
  "/",
  protect,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createRecipe
);

router.post("/:id/reviews", protect, addReview);

router.put("/:id", protect, updateRecipe);
router.delete("/:id", protect, deleteRecipe);

module.exports = router;