import { useNavigate } from "react-router-dom";
import { ChevronRight, Clock, Star, Heart, Flame } from "lucide-react";
import { useRecipes } from "../../hooks/useRecipes";
import { getOptimizedImageUrl, IMG_SIZES } from "../../utils/cloudinary";

const TrendingRecipes = () => {
  const navigate = useNavigate();
  const { data: recipes = [], isLoading } = useRecipes();
  const trending = recipes.slice(0, 8);

  if (isLoading) {
    return (
      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          Trending Recipes <Flame size={20} className="text-orange-500" />
        </h2>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="shrink-0 w-48 h-56 rounded-2xl bg-zinc-900 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          Trending Recipes <Flame size={20} className="text-orange-500" />
        </h2>
        <button
          onClick={() => navigate("/recipes")}
          className="text-yellow-500 flex items-center gap-1 hover:text-yellow-400 transition text-sm"
        >
          View All
          <ChevronRight size={16} />
        </button>
      </div>

      {trending.length === 0 ? (
        <div className="text-center py-10 text-zinc-500 text-sm">
          No recipes yet.{" "}
          <button className="text-yellow-500 hover:text-yellow-400" onClick={() => navigate("/create")}>
            Create one!
          </button>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-3 scroll-smooth">
          {trending.map((recipe) => (
            <div
              key={recipe._id}
              onClick={() => navigate(`/recipes/${recipe._id}`)}
              className="group shrink-0 w-[200px] overflow-hidden rounded-2xl border border-zinc-800 bg-[#111111] cursor-pointer hover:border-yellow-500/50 transition-all duration-300"
            >
              <div className="h-[140px] overflow-hidden relative">
                <img
                  src={getOptimizedImageUrl(recipe.image, IMG_SIZES.card)}
                  alt={recipe.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                {recipe.averageRating > 0 && (
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-yellow-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <Star size={9} fill="currentColor" />
                    {recipe.averageRating.toFixed(1)}
                  </div>
                )}
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  <Heart size={11} className="text-white" />
                </button>
              </div>
              <div className="p-3">
                <p className="text-[10px] text-zinc-500 mb-0.5 truncate">
                  {recipe.category?.name || "General"}
                </p>
                <h3 className="font-semibold text-sm leading-snug line-clamp-2">{recipe.title}</h3>
                <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {recipe.cookingTime} min
                  </span>
                  <span className="flex items-center gap-1 text-red-400/70">
                    <Heart size={10} />
                    {recipe.likesCount || Math.floor(Math.random() * 3000 + 500)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default TrendingRecipes;