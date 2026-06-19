const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
 
const connectDB = require("./config/db");
 
dotenv.config();
connectDB();
 
const app = express();
 
app.use(cors());
app.use(express.json());
 
app.get("/", (req, res) => {
  res.send("Tastes-Shit App is running successfully!");
});
 
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
 
const recipeRoutes = require("./routes/recipeRoutes");
app.use("/api/recipes", recipeRoutes);
 
const categoryRoutes = require("./routes/categoryRoutes");
app.use("/api/categories", categoryRoutes);
 

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});
 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});