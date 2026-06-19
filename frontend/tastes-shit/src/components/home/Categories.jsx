import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useCategories } from "../../hooks/useCategories";
import { useRecipes } from "../../hooks/useRecipes";
import { getOptimizedImageUrl, IMG_SIZES } from "../../utils/cloudinary";

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
};

const getEmoji = (name) => EMOJI_MAP[name] || "🍽️";

const Categories = () => {
  const navigate = useNavigate();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: allRecipes = [], isLoading: recipesLoading } = useRecipes();


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

  const isLoading = categoriesLoading || recipesLoading;

  if (isLoading) {
    return (
      <section className="mt-10 overflow-hidden">
        <h2 className="text-2xl font-bold mb-6">Categories</h2>
        <div className="flex gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="shrink-0 w-60 h-24 rounded-2xl bg-zinc-900 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Categories</h2>
        <button
          onClick={() => navigate("/categories")}
          className="text-yellow-500 flex items-center gap-1 hover:text-yellow-400 transition text-sm"
        >
          View All
          <ChevronRight size={16} />
        </button>
      </div>


      <div className="w-full overflow-hidden">
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-3 scroll-smooth">
          {categories.map((category) => {
            const firstImage = categoryFirstImageMap[category._id] || null;
            return (
              <div
                key={category._id}
                onClick={() => navigate(`/recipes?category=${category.name}`)}
                className="shrink-0 w-60 bg-[#111111] border border-zinc-800 rounded-2xl p-4 hover:border-yellow-500 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="shrink-0 h-14 w-14 rounded-full overflow-hidden border border-zinc-700">
                    {firstImage ? (
                      <img
                        src={getOptimizedImageUrl(firstImage, IMG_SIZES.thumbnail)}
                        alt={category.name}
                        className="h-full w-full object-cover"
                      />
                    ) : category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-yellow-500/20 flex items-center justify-center text-xl">
                        {getEmoji(category.name)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold truncate text-sm">
                      {category.name}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 mt-0.5">
                      {category.description || "Explore recipes"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;