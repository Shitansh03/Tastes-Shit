const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("favorites", "title image cookingTime averageRating");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, bio, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, bio, avatar },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle Favorite
exports.toggleFavorite = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const user = await User.findById(req.user.id);

    const isFav = user.favorites.includes(recipeId);

    if (isFav) {
      user.favorites = user.favorites.filter(
        (id) => id.toString() !== recipeId
      );
    } else {
      user.favorites.push(recipeId);
    }

    await user.save();

    res.json({
      success: true,
      isFavorite: !isFav,
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};