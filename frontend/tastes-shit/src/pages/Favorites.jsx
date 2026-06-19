import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Clock,
  Star,
  Play,
  Plus,
  ChevronDown,
  Grid3X3,
  List,
  MoreVertical,
} from "lucide-react";
import { useRecipes } from "../hooks/useRecipes";
import { useAuth } from "../components/auth/AuthContext";

const filterTabs = ["All", "Recipes", "Videos", "Chefs"];
const sortOptions = ["Recently Added", "Top Rated", "Quickest", "Oldest"];

const COLLECTIONS = [
  {
    label: "Weeknight Dinners",
    count: 12,
    images: [
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80",
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&q=80",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80",
      "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=200&q=80",
    ],
  },
  {
    label: "Weekend Treats",
    count: 8,
    images: [
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&q=80",
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&q=80",
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=200&q=80",
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=200&q=80",
    ],
  },
  {
    label: "Healthy Picks",
    count: 15,
    images: [
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=80",
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&q=80",
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=200&q=80",
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=200&q=80",
    ],
  },
];


const RecipeGridCard = ({ recipe, isFavorited, onToggleFav, onNavigate }) => {
  const hasVideo = Boolean(recipe.video);
  const rating =
    recipe.averageRating > 0 ? recipe.averageRating.toFixed(1) : "4.9";

  return (
    <div
      onClick={() => onNavigate(recipe._id)}
      className="group relative rounded-2xl overflow-hidden cursor-pointer border border-zinc-800/50 bg-[#111111] hover:border-zinc-700 transition-all duration-300"
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: "1/1" }}>
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {hasVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
              <Play size={18} fill="white" className="text-white ml-0.5" />
            </div>
          </div>
        )}

        <button
          className="absolute top-3 right-3 w-9 h-9 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/80 transition z-10"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFav(recipe._id);
          }}
        >
          <Heart
            size={16}
            fill="red"
            className="text-red-500"
          />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-bold text-base text-white leading-snug mb-2">
            {recipe.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-zinc-300">
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {recipe.cookingTime} min
            </span>
            <span className="flex items-center gap-1 text-yellow-400">
              <Star size={11} fill="currentColor" />
              {rating}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};


const CollectionItem = ({ collection }) => (
  <div className="flex items-center gap-3 group cursor-pointer hover:bg-zinc-800/40 rounded-xl p-1.5 -mx-1.5 transition">
    <div className="grid grid-cols-2 gap-0.5 w-16 h-12 rounded-lg overflow-hidden shrink-0">
      {collection.images.slice(0, 4).map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className="w-full h-full object-cover"
        />
      ))}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-white truncate">
        {collection.label}
      </p>
      <p className="text-xs text-zinc-500">{collection.count} Recipes</p>
    </div>
    <button className="text-zinc-600 hover:text-zinc-400 transition shrink-0">
      <MoreVertical size={16} />
    </button>
  </div>
);

const Favorites = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Recently Added");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const { data: recipes = [], isLoading } = useRecipes();

  const shownRecipes = useMemo(() => {
    let list = [...recipes.slice(0, 8)];
    if (activeFilter === "Videos") list = list.filter((r) => r.video);
    if (activeFilter === "Recipes") list = list.filter((r) => !r.video);
    return list;
  }, [recipes, activeFilter]);


  const recentlyAdded = useMemo(
    () => recipes.slice(0, 4),
    [recipes]
  );

  const savedCount = shownRecipes.length;

  if (!user) {
    return (
      <div className="text-center py-24">
        <Heart size={48} className="mx-auto mb-4 text-zinc-700" />
        <p className="text-zinc-400 text-lg font-medium mb-2">
          Save your favourite recipes
        </p>
        <p className="text-zinc-600 text-sm mb-6">
          Login to start building your collection
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-yellow-500 text-black px-6 py-2.5 rounded-xl font-semibold hover:bg-yellow-400 transition"
        >
          Login to continue
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-6 max-w-[1200px] mx-auto">
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3 mb-1">
              Favorites{" "}
              <Heart size={32} fill="red" className="text-red-500" />
            </h1>
            <p className="text-zinc-500 text-sm">
              Your saved recipes, videos &amp; chefs in one place.
            </p>
          </div>


          <div className="flex flex-col items-center justify-center bg-[#111111] border border-zinc-800 rounded-2xl px-6 py-3 shrink-0">
            <p className="text-3xl font-bold text-yellow-500">{savedCount || 36}</p>
            <p className="text-xs text-zinc-500 mt-0.5">Saved Items</p>
          </div>
        </div>


        <div className="flex items-center justify-between mb-6">
          <div className="flex bg-[#111111] border border-zinc-800 rounded-2xl p-1 gap-1">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeFilter === tab
                    ? "bg-yellow-500 text-black shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-xl text-sm text-zinc-300 hover:border-zinc-600 hover:text-white transition"
              >
                {sortBy}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${showSortMenu ? "rotate-180" : ""}`}
                />
              </button>
              {showSortMenu && (
                <div className="absolute right-0 top-11 z-20 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl overflow-hidden w-48">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setSortBy(opt);
                        setShowSortMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition hover:bg-zinc-800 ${
                        sortBy === opt
                          ? "text-yellow-500 font-medium"
                          : "text-zinc-400"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>


            <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 gap-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition ${
                  viewMode === "grid"
                    ? "bg-zinc-700 text-white"
                    : "text-zinc-600 hover:text-zinc-400"
                }`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition ${
                  viewMode === "list"
                    ? "bg-zinc-700 text-white"
                    : "text-zinc-600 hover:text-zinc-400"
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>


        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl bg-zinc-900 animate-pulse"
              />
            ))}
          </div>
        ) : shownRecipes.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <Heart size={44} className="mx-auto mb-3 opacity-20" />
            <p className="text-lg font-medium">No favorites here yet</p>
            <button
              onClick={() => navigate("/recipes")}
              className="mt-4 bg-yellow-500 text-black px-5 py-2 rounded-xl text-sm font-semibold hover:bg-yellow-400 transition"
            >
              Browse Recipes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {shownRecipes.map((recipe) => (
              <RecipeGridCard
                key={recipe._id}
                recipe={recipe}
                isFavorited={true}
                onNavigate={(id) => navigate(`/recipes/${id}`)}
                onToggleFav={() => {}}
              />
            ))}
          </div>
        )}
      </div>

      <div className="w-[280px] shrink-0 space-y-6">
        <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-white text-base">Collections</h3>
            <button className="text-yellow-500 text-sm hover:text-yellow-400 transition font-medium">
              View all
            </button>
          </div>

          <div className="space-y-1">
            {COLLECTIONS.map((col) => (
              <CollectionItem key={col.label} collection={col} />
            ))}
          </div>

          <button className="w-full mt-4 flex items-center justify-center gap-2 border border-yellow-500/40 text-yellow-500 hover:bg-yellow-500/10 transition rounded-xl py-2.5 text-sm font-medium">
            <Plus size={16} />
            New Collection
          </button>
        </div>

        <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-white text-base">Recently Added</h3>
            <button className="text-yellow-500 text-sm hover:text-yellow-400 transition font-medium">
              View all
            </button>
          </div>

          <div className="space-y-3">
            {isLoading
              ? [...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-12 h-12 rounded-xl bg-zinc-800 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-zinc-800 rounded w-3/4" />
                      <div className="h-3 bg-zinc-800 rounded w-1/2" />
                    </div>
                  </div>
                ))
              : recentlyAdded.map((recipe) => (
                  <div
                    key={recipe._id}
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => navigate(`/recipes/${recipe._id}`)}
                  >
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 group-hover:opacity-80 transition"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate group-hover:text-yellow-400 transition">
                        {recipe.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {recipe.cookingTime} min
                        </span>
                        <span className="text-zinc-700">•</span>
                        <span className="flex items-center gap-1 text-yellow-500">
                          <Star size={10} fill="currentColor" />
                          {recipe.averageRating > 0
                            ? recipe.averageRating.toFixed(1)
                            : "4.8"}
                        </span>
                      </div>
                    </div>
                    <button
                      className="shrink-0 text-red-500"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Heart size={16} fill="currentColor" />
                    </button>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favorites;