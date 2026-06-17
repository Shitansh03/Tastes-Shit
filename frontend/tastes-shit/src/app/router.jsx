import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import Recipes from "../pages/Recipes";
import RecipeDetails from "../pages/RecipeDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import CreateRecipe from "../pages/CreateRecipe";
import Profile from "../pages/Profile";
import Favorites from "../pages/Favorites";
import Categories from "../pages/Categories";
import Community from "../pages/Community";
import MyRecipes from "../pages/MyRecipes";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/recipes", element: <Recipes /> },
      { path: "/recipes/:id", element: <RecipeDetails /> },
      { path: "/create", element: <CreateRecipe /> },
      { path: "/profile", element: <Profile /> },
      { path: "/favorites", element: <Favorites /> },
      { path: "/categories", element: <Categories /> },
      { path: "/community", element: <Community /> },
      { path: "/my-recipes", element: <MyRecipes /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);
