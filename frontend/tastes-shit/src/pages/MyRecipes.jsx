import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Clock,
  Star,
  MoreVertical,
  Edit2,
  Trash2,
  ChefHat,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRecipe } from "../api/recipeApi";
import { useRecipes } from "../hooks/useRecipes";
import { useAuth } from "../components/auth/AuthContext";
import toast from "react-hot-toast";

const myRecipesTabs = ["All", "Published", "Drafts"];

const MyRecipes = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("All");
  const [openMenuId, setOpenMenuId] = useState(null);

  const { data: allRecipes = [], isLoading } = useRecipes();

  const myRecipes = allRecipes.filter(
    (r) => r.createdBy?._id === user?._id || r.createdBy === user?._id
  );

  const filtered =
    activeTab === "All"
      ? myRecipes
      : activeTab === "Published"
      ? myRecipes.filter((r) => !r.isDraft)
      : myRecipes.filter((r) => r.isDraft);

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      toast.success("Recipe deleted");
      setOpenMenuId(null);
    },
    onError: () => toast.error("Failed to delete"),
  });

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-400 mb-4">Please login to see your recipes</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-yellow-500 text-black px-6 py-2 rounded-xl font-semibold"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Recipes</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {myRecipes.length} recipes total
          </p>
        </div>
        <button
          onClick={() => navigate("/create")}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2.5 rounded-xl text-sm font-semibold transition"
        >
          <Plus size={16} />
          Create New
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {myRecipesTabs.map((tab) => {
          const count =
            tab === "All"
              ? myRecipes.length
              : tab === "Published"
              ? myRecipes.filter((r) => !r.isDraft).length
              : myRecipes.filter((r) => r.isDraft).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-1.5 ${
                activeTab === tab
                  ? "bg-yellow-500 text-black"
                  : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              {tab}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab ? "bg-black/20 text-black" : "bg-zinc-800 text-zinc-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-zinc-900 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <ChefHat size={40} className="mx-auto mb-3 opacity-30" />
          <p>No recipes here yet</p>
          <button
            onClick={() => navigate("/create")}
            className="mt-4 bg-yellow-500 text-black px-5 py-2 rounded-xl text-sm font-semibold"
          >
            Create your first recipe
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((recipe) => (
            <div
              key={recipe._id}
              className="flex items-center gap-4 bg-[#111111] border border-zinc-800 rounded-2xl p-4 hover:border-zinc-700 transition relative"
            >
              {/* Image */}
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0 cursor-pointer"
                onClick={() => navigate(`/recipes/${recipe._id}`)}
              />

              {/* Info */}
              <div
                className="flex-1 min-w-0 cursor-pointer"
                onClick={() => navigate(`/recipes/${recipe._id}`)}
              >
                <h3 className="font-semibold truncate">{recipe.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {recipe.cookingTime} min
                  </span>
                  <span className="flex items-center gap-1 text-yellow-500">
                    <Star size={11} fill="currentColor" />
                    {recipe.averageRating > 0
                      ? recipe.averageRating.toFixed(1)
                      : "—"}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full ${
                      recipe.isDraft
                        ? "bg-zinc-800 text-zinc-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {recipe.isDraft ? "Draft" : "Published"}
                  </span>
                </div>
              </div>

              {/* Menu */}
              <div className="relative">
                <button
                  onClick={() =>
                    setOpenMenuId(openMenuId === recipe._id ? null : recipe._id)
                  }
                  className="w-8 h-8 flex items-center justify-center rounded-xl border border-zinc-700 hover:border-zinc-500 transition text-zinc-400"
                >
                  <MoreVertical size={15} />
                </button>

                {openMenuId === recipe._id && (
                  <div className="absolute right-0 top-10 z-10 bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden shadow-xl w-36">
                    <button
                      onClick={() => {
                        navigate(`/recipes/${recipe._id}`);
                        setOpenMenuId(null);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-zinc-800 transition text-left"
                    >
                      <Edit2 size={14} />
                      View / Edit
                    </button>
                    <button
                      onClick={() => deleteMutate(recipe._id)}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-zinc-800 transition text-red-400 text-left"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRecipes;
