import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, Clock, Star } from "lucide-react";
import { useRecipes } from "../hooks/useRecipes";
import { useCategories } from "../hooks/useCategories";
import { getOptimizedImageUrl, IMG_SIZES } from "../utils/cloudinary";

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/recipes/${recipe._id}`)}
      className="group overflow-hidden rounded-2xl border border-zinc-800 bg-[#111111] cursor-pointer hover:border-yellow-500/50 transition-all duration-300"
    >
      <div className="h-60 overflow-hidden relative">
        <img
          src={getOptimizedImageUrl(recipe.image, IMG_SIZES.cardLarge)}
          alt={recipe.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        {recipe.averageRating > 0 && (
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-yellow-500 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
            <Star size={11} fill="currentColor" />
            {recipe.averageRating.toFixed(1)}
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-zinc-500 mb-1">{recipe.category?.name || "General"}</p>
        <h3 className="font-semibold text-base leading-snug">{recipe.title}</h3>
        <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{recipe.description}</p>
        <div className="mt-3 flex items-center justify-between text-sm text-zinc-400">
          <span className="flex items-center gap-1">
            <Clock size={13} />
            {recipe.cookingTime} min
          </span>
          <span className="text-xs text-zinc-600">by {recipe.createdBy?.username || "Chef"}</span>
        </div>
      </div>
    </div>
  );
};

const Recipes = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const { data: categories = [] } = useCategories();
  const { data: recipes = [], isLoading } = useRecipes(
    activeCategory !== "All" ? activeCategory : undefined,
    search || undefined
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">All Recipes</h1>
          <p className="text-zinc-500 text-sm mt-1">{recipes.length} recipes found</p>
        </div>
        <button className="flex items-center gap-2 border border-zinc-700 px-4 py-2 rounded-xl text-sm hover:border-yellow-500 transition">
          <SlidersHorizontal size={15} />
          Filters
        </button>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-yellow-500 transition placeholder:text-zinc-600 text-sm"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-8">
        {["All", ...categories.map((c) => c.name)].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition ${
              activeCategory === cat ? "bg-yellow-500 text-black" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-zinc-800 bg-[#111111] h-72 animate-pulse" />
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-lg">No recipes found</p>
          <p className="text-sm mt-1">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes;