import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  Edit2,
  Clock,
  Star,
  Heart,
  Grid3X3,
  ChefHat,
  LogOut,
} from "lucide-react";
import { useAuth } from "../components/auth/AuthContext";
import { useRecipes } from "../hooks/useRecipes";
import toast from "react-hot-toast";

const profileTabs = ["Recipes", "Favorites", "Reviews", "Activity"];

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Recipes");

  const { data: allRecipes = [] } = useRecipes();

  const myRecipes = allRecipes.filter(
    (r) => r.createdBy?._id === user?._id || r.createdBy === user?._id
  );

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-400 mb-4">You're not logged in</p>
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-[#111111] border border-zinc-800 rounded-3xl p-8 mb-6 relative">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-5">
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  className="w-20 h-20 rounded-full object-cover border-2 border-yellow-500/50"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center border-2 border-yellow-500/30">
                  <ChefHat size={32} className="text-yellow-500" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#111111]" />
            </div>


            <div>
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <p className="text-zinc-500 text-sm">@{user.username.toLowerCase()}</p>
              <p className="text-zinc-400 text-sm mt-1">
                Food Enthusiast | Home Chef
              </p>
            </div>
          </div>


          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 border border-zinc-700 px-4 py-2 rounded-xl text-sm hover:border-yellow-500 transition">
              <Edit2 size={14} />
              Edit Profile
            </button>
            <button className="border border-zinc-700 p-2 rounded-xl hover:border-zinc-500 transition">
              <Settings size={16} />
            </button>
            <button
              onClick={handleLogout}
              className="border border-zinc-700 p-2 rounded-xl hover:border-red-500 hover:text-red-400 transition"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-8">
          {[
            { label: "Recipes", value: myRecipes.length },
            { label: "Followers", value: "1.2k" },
            { label: "Following", value: "310" },
            { label: "Likes", value: "4.6k" },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-xl font-bold">{value}</p>
              <p className="text-zinc-500 text-sm mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-1 bg-zinc-900 rounded-xl p-1 mb-6 w-fit">
        {profileTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === tab
                ? "bg-yellow-500 text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Recipes" && (
        <div>
          {myRecipes.length === 0 ? (
            <div className="text-center py-20 text-zinc-500">
              <Grid3X3 size={40} className="mx-auto mb-3 opacity-30" />
              <p>No recipes yet</p>
              <button
                onClick={() => navigate("/create")}
                className="mt-4 bg-yellow-500 text-black px-5 py-2 rounded-xl text-sm font-semibold"
              >
                Create your first recipe
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {myRecipes.map((recipe) => (
                <div
                  key={recipe._id}
                  onClick={() => navigate(`/recipes/${recipe._id}`)}
                  className="group cursor-pointer rounded-2xl border border-zinc-800 bg-[#111111] overflow-hidden hover:border-yellow-500/40 transition"
                >
                  <div className="h-40 overflow-hidden">
                    <img
                      src={recipe.image}
                      alt=""
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{recipe.title}</h3>
                    <div className="flex items-center justify-between mt-2 text-xs text-zinc-500">
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
                          recipe.isSystemRecipe
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        Published
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "Favorites" && (
        <div className="text-center py-20 text-zinc-500">
          <Heart size={40} className="mx-auto mb-3 opacity-30" />
          <p>No favorites yet</p>
          <button
            onClick={() => navigate("/recipes")}
            className="mt-4 text-yellow-500 text-sm hover:text-yellow-400"
          >
            Browse recipes to add favorites
          </button>
        </div>
      )}

      {activeTab === "Reviews" && (
        <div className="text-center py-20 text-zinc-500">
          <Star size={40} className="mx-auto mb-3 opacity-30" />
          <p>No reviews yet</p>
        </div>
      )}

      {activeTab === "Activity" && (
        <div className="text-center py-20 text-zinc-500">
          <p>No recent activity</p>
        </div>
      )}
    </div>
  );
};

export default Profile;