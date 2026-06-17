const express = require("express");
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  toggleFavorite,
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.post("/favorites/:recipeId", protect, toggleFavorite);

module.exports = router;