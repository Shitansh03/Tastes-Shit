import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Clock, Flame, Users, Star, Play,
  Heart, Bookmark, Share2, MoreHorizontal, CheckCircle2, ChefHat,
} from "lucide-react";
import { useRecipe } from "../hooks/useRecipes";
import { getOptimizedImageUrl, IMG_SIZES } from "../utils/cloudinary";

const tabs = ["Overview", "Ingredients", "Steps", "Video"];

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");
  const [completedSteps, setCompletedSteps] = useState([]);
  const { data: recipe, isLoading } = useRecipe(id);

  const toggleStep = (i) => {
    setCompletedSteps((prev) =>
      prev.includes(i) ? prev.filter((s) => s !== i) : [...prev, i]
    );
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4 max-w-5xl mx-auto">
        <div className="h-64 rounded-3xl bg-zinc-900" />
        <div className="h-8 w-1/2 bg-zinc-900 rounded" />
        <div className="h-4 w-1/3 bg-zinc-900 rounded" />
      </div>
    );
  }

  if (!recipe) {
    return <div className="text-center py-20 text-zinc-500">Recipe not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-zinc-400 hover:text-white transition mb-6"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="relative rounded-3xl overflow-hidden h-80 lg:h-auto">
          <img
            src={getOptimizedImageUrl(recipe.image, IMG_SIZES.hero)}
            alt={recipe.title}
            className="h-full w-full object-cover"
          />
          {recipe.video && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setActiveTab("Video")}
                className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center shadow-xl hover:bg-yellow-400 transition"
              >
                <Play size={24} fill="black" className="text-black ml-1" />
              </button>
            </div>
          )}
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
            Watch Full Recipe
          </div>
        </div>


        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-yellow-500/20 text-yellow-500 text-xs font-semibold px-3 py-1 rounded-full">
              {recipe.category?.name || "General"}
            </span>
          </div>

          <h1 className="text-4xl font-bold mb-3">{recipe.title}</h1>

          <div className="flex items-center gap-4 text-sm text-zinc-400 mb-4">
            <span className="flex items-center gap-1 text-yellow-500 font-semibold">
              <Star size={14} fill="currentColor" />
              {recipe.averageRating > 0
                ? `${recipe.averageRating.toFixed(1)} (${recipe.reviewCount || 0} reviews)`
                : "No ratings yet"}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={13} />
              {recipe.cookingTime} min
            </span>
            <span>{recipe.difficulty || "Medium"}</span>
          </div>

          <div className="flex items-center gap-3 p-4 bg-zinc-900 rounded-2xl mb-6">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center overflow-hidden">
              {recipe.createdBy?.avatar ? (
                <img
                  src={getOptimizedImageUrl(recipe.createdBy.avatar, IMG_SIZES.thumbnail)}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <ChefHat size={20} className="text-yellow-500" />
              )}
            </div>
            <div>
              <p className="font-semibold text-sm">{recipe.createdBy?.username || "Chef"}</p>
              <p className="text-xs text-zinc-500">{recipe.createdBy?.bio || "Home Chef"}</p>
            </div>
            <button className="ml-auto bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-semibold px-4 py-2 rounded-xl transition">
              Follow
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <button className="flex items-center gap-2 border border-zinc-700 hover:border-red-500 px-4 py-2 rounded-xl text-sm transition hover:text-red-400">
              <Heart size={16} /> Save
            </button>
            <button className="flex items-center gap-2 border border-zinc-700 hover:border-yellow-500 px-4 py-2 rounded-xl text-sm transition hover:text-yellow-400">
              <Bookmark size={16} /> Bookmark
            </button>
            <button className="flex items-center gap-2 border border-zinc-700 px-4 py-2 rounded-xl text-sm transition hover:border-zinc-500">
              <Share2 size={16} /> Share
            </button>
            <button className="border border-zinc-700 p-2 rounded-xl hover:border-zinc-500 transition">
              <MoreHorizontal size={16} />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Prep Time", value: `${Math.floor(recipe.cookingTime / 3)} min`, icon: Clock },
              { label: "Cook Time", value: `${recipe.cookingTime} min`, icon: Flame },
              { label: "Servings", value: `${recipe.servings || 4} People`, icon: Users },
              { label: "Calories", value: `${recipe.calories || 560} kcal`, icon: Flame },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-zinc-900 rounded-2xl p-3 text-center">
                <Icon size={18} className="text-zinc-500 mx-auto mb-1" />
                <p className="text-xs text-zinc-500">{label}</p>
                <p className="text-sm font-semibold mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-1 bg-zinc-900 rounded-xl p-1 mb-8 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === tab ? "bg-yellow-500 text-black" : "text-zinc-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && (
        <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6">
          <h3 className="font-semibold text-lg mb-3">About This Recipe</h3>
          <p className="text-zinc-400 leading-relaxed">{recipe.description}</p>
        </div>
      )}

      {activeTab === "Ingredients" && (
        <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6">
          <h3 className="font-semibold text-lg mb-5">Ingredients ({recipe.ingredients?.length || 0})</h3>
          <div className="space-y-3">
            {recipe.ingredients?.map((ingredient, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-zinc-800 last:border-0">
                <div className="w-2 h-2 rounded-full bg-yellow-500 shrink-0" />
                <span className="text-zinc-300">{ingredient}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "Steps" && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg mb-2">Steps ({recipe.instructions?.length || 0})</h3>
          {recipe.instructions?.map((step, i) => (
            <div
              key={i}
              className={`flex gap-4 p-5 rounded-2xl border transition cursor-pointer ${
                completedSteps.includes(i)
                  ? "border-yellow-500/50 bg-yellow-500/5"
                  : "border-zinc-800 bg-[#111111] hover:border-zinc-700"
              }`}
              onClick={() => toggleStep(i)}
            >
              <div className="shrink-0">
                {completedSteps.includes(i) ? (
                  <CheckCircle2 size={24} className="text-yellow-500" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center text-sm font-bold">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                )}
              </div>
              <p className={`text-sm leading-relaxed ${completedSteps.includes(i) ? "text-zinc-500 line-through" : "text-zinc-300"}`}>
                {step}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Video" && (
        <div className="bg-[#111111] border border-zinc-800 rounded-2xl overflow-hidden">
          {recipe.video ? (
            <video src={recipe.video} controls className="w-full max-h-96 object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
              <Play size={40} className="mb-3 opacity-30" />
              <p>No video available for this recipe</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipeDetails;