import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, BookOpen } from "lucide-react";
import { useCategories } from "../hooks/useCategories";
import { useRecipes } from "../hooks/useRecipes";
import { getOptimizedImageUrl, IMG_SIZES } from "../utils/cloudinary";

const EMOJI_MAP = {
  Indian: "🍛",
  Italian: "🍝",
  Asian: "🍜",
  Desserts: "🍰",
  Healthy: "🥗",
  BBQ: "🔥",
  Mexican: "🌮",
  Chinese: "🥡",
  Japanese: "🍱",
  American: "🍔",
  Mediterranean: "🫒",
  Breakfast: "🍳",
  Snacks: "🍿",
  Seafood: "🦐",
};

const DESCRIPTION_MAP = {
  Indian: "A rich blend of spices, herbs and traditional flavors.",
  Italian: "Classic pasta, pizza, and timeless Italian favorites.",
  Chinese: "Bold flavors and aromatic ingredients from China.",
  Japanese: "Balanced, fresh, and artfully crafted Japanese cuisine.",
  Mexican: "Vibrant, bold, and full of traditional Mexican flavors.",
  American: "Hearty, comforting, and classic American dishes.",
  Mediterranean: "Fresh, wholesome, and inspired by Mediterranean traditions.",
  Asian: "Diverse flavors from across Asia in one place.",
  Desserts: "Sweet treats and indulgent desserts for every mood.",
  Healthy: "Nutritious, balanced, and good for your lifestyle.",
  BBQ: "Smoky, grilled, and packed with BBQ goodness.",
  Breakfast: "Energizing and delicious breakfast ideas.",
  Snacks: "Quick, tasty, and perfect for any time cravings.",
  Seafood: "Fresh catches and ocean inspired recipes.",
};

const getEmoji = (name) => EMOJI_MAP[name] || "🍽️";
const getDescription = (name, description) =>
  description || DESCRIPTION_MAP[name] || "Explore delicious recipes.";

const CategoryCard = ({ category, firstRecipeImage, onClick }) => {
  const count = category.recipeCount || 0;

  return (
    <div
      onClick={onClick}
      className="group flex items-center gap-4 bg-[#111111] border border-zinc-800 rounded-2xl p-5 cursor-pointer hover:border-yellow-500/60 transition-all duration-300 hover:bg-[#161616] hover:shadow-lg hover:shadow-yellow-500/5"
    >
      {/* Circle Image */}
      <div className="shrink-0 w-[90px] h-[90px] rounded-full overflow-hidden border-2 border-zinc-700 group-hover:border-yellow-500/50 transition-all duration-300">
        {firstRecipeImage ? (
          <img
            src={getOptimizedImageUrl(firstRecipeImage, IMG_SIZES.thumbnail)}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-3xl">
            {getEmoji(category.name)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-yellow-400 transition-colors duration-200">
          {category.name}
        </h3>
        <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed mb-3">
          {getDescription(category.name, category.description)}
        </p>
        <div className="flex items-center gap-1.5 text-yellow-500 text-sm font-medium">
          <BookOpen size={14} />
          <span>{count} Recipes</span>
        </div>
      </div>
    </div>
  );
};

const CategoryCardSkeleton = () => (
  <div className="flex items-center gap-4 bg-[#111111] border border-zinc-800 rounded-2xl p-5 animate-pulse">
    <div className="shrink-0 w-[90px] h-[90px] rounded-full bg-zinc-800" />
    <div className="flex-1 space-y-3">
      <div className="h-5 bg-zinc-800 rounded w-1/3" />
      <div className="h-4 bg-zinc-800 rounded w-full" />
      <div className="h-4 bg-zinc-800 rounded w-2/3" />
      <div className="h-4 bg-zinc-800 rounded w-1/4" />
    </div>
  </div>
);

const Categories = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: allRecipes = [], isLoading: recipesLoading } = useRecipes();

  // Build a map: categoryId → first recipe image
  const categoryFirstImageMap = useMemo(() => {
    const map = {};
    if (!allRecipes.length) return map;

    allRecipes.forEach((recipe) => {
      const catId =
        typeof recipe.category === "object" ? recipe.category?._id : recipe.category;
      if (catId && !map[catId] && recipe.image) {
        map[catId] = recipe.image;
      }
    });

    return map;
  }, [allRecipes]);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description || "").toLowerCase().includes(q)
    );
  }, [categories, search]);

  const isLoading = categoriesLoading || recipesLoading;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Categories</h1>
        <p className="text-zinc-500 text-sm mt-1">Explore recipes by cuisine</p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
        />
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-yellow-500/60 transition-colors placeholder:text-zinc-600 text-sm text-white"
        />
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-24 text-zinc-500">
          <p className="text-lg font-medium">No categories found</p>
          <p className="text-sm mt-1">Try a different search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCategories.map((category) => {
            const firstImage = categoryFirstImageMap[category._id] || null;
            return (
              <CategoryCard
                key={category._id}
                category={category}
                firstRecipeImage={firstImage}
                onClick={() => navigate(`/recipes?category=${category.name}`)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Categories;
