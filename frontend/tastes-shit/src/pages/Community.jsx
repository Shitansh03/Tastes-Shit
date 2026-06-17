import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Share2,
  Clock,
  Star,
  Users,
  Bookmark,
  MoreHorizontal,
  BadgeCheck,
  Flame,
  BarChart2,
} from "lucide-react";
import { useRecipes } from "../hooks/useRecipes";

const communityTabs = [
  { label: "Trending", icon: Flame },
  { label: "Latest", icon: Clock },
  { label: "Following", icon: Users },
];

// Static top chefs for sidebar
const TOP_CHEFS = [
  {
    rank: "01",
    name: "Chef Sarah Khan",
    role: "Professional Chef",
    followers: "12.4k",
    verified: true,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
  },
  {
    rank: "02",
    name: "Meera Iyer",
    role: "Home Chef",
    followers: "9.8k",
    verified: true,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80",
  },
  {
    rank: "03",
    name: "Arjun Patel",
    role: "Food Enthusiast",
    followers: "8.7k",
    verified: true,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80",
  },
  {
    rank: "04",
    name: "Diya Malhotra",
    role: "Baking Enthusiast",
    followers: "6.1k",
    verified: true,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80",
  },
  {
    rank: "05",
    name: "Rohan Das",
    role: "Grill Master",
    followers: "5.3k",
    verified: false,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80",
  },
];

const CHEF_META = [
  {
    name: "Chef Sarah Khan",
    role: "Professional Chef",
    verified: true,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
  },
  {
    name: "Meera Iyer",
    role: "Home Chef",
    verified: true,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80",
  },
  {
    name: "Arjun Patel",
    role: "Food Enthusiast",
    verified: true,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80",
  },
];

const getChefMeta = (index) => CHEF_META[index % CHEF_META.length];
const getTimeAgo = (index) => {
  const times = ["2h ago", "4h ago", "6h ago", "8h ago", "1d ago", "2d ago"];
  return times[index % times.length];
};
const getLikesCount = (index) => {
  const counts = ["2.1k", "1.6k", "1.2k", "980", "756", "543"];
  return counts[index % counts.length];
};
const getCommentsCount = (index) => {
  const counts = [162, 98, 74, 45, 31, 22];
  return counts[index % counts.length];
};
const getDifficultyColor = (difficulty) => {
  if (!difficulty)
    return "text-yellow-400 bg-yellow-500/10 border border-yellow-500/20";
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "text-green-400 bg-green-500/10 border border-green-500/20";
    case "hard":
      return "text-red-400 bg-red-500/10 border border-red-500/20";
    default:
      return "text-yellow-400 bg-yellow-500/10 border border-yellow-500/20";
  }
};

const Community = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Trending");
  const [likedPosts, setLikedPosts] = useState({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState({});
  const { data: recipes = [], isLoading } = useRecipes();

  const sorted =
    activeTab === "Latest" ? [...recipes].reverse() : recipes;

  const toggleLike = (id, e) => {
    e.stopPropagation();
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const toggleBookmark = (id, e) => {
    e.stopPropagation();
    setBookmarkedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Trending This Week: take first 5 recipes for sidebar
  const trendingThisWeek = recipes.slice(0, 5);

  return (
    <div className="flex gap-6 max-w-[1200px] mx-auto">
      {/* ─── Main Feed ─── */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3 mb-1">
              Community
              <span className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <Users size={18} className="text-zinc-300" />
              </span>
            </h1>
            <p className="text-zinc-500 text-sm">
              Discover recipes &amp; stories from passionate chefs around the
              world.
            </p>
          </div>

          {/* Active chefs avatars */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex -space-x-2">
              {[
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=80",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80",
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=80",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&q=80",
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="w-9 h-9 rounded-full border-2 border-black object-cover"
                />
              ))}
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-yellow-500">128+</p>
              <p className="text-xs text-zinc-500">Active Chefs</p>
            </div>
          </div>
        </div>

        {/* Tabs + Sort */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {communityTabs.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setActiveTab(label)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border ${activeTab === label
                    ? "bg-yellow-500 text-black border-yellow-500 shadow-sm"
                    : "bg-transparent border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
                  }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          <select className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-300 outline-none cursor-pointer">
            <option>Popular</option>
            <option>Newest</option>
            <option>Most Liked</option>
          </select>
        </div>

        {/* Posts Feed */}
        {isLoading ? (
          <div className="space-y-5">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-zinc-900/50 border border-zinc-800 overflow-hidden animate-pulse"
              >
                <div className="h-14 bg-zinc-800/50" />
                <div className="h-56 bg-zinc-800" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-zinc-800 rounded w-1/2" />
                  <div className="h-4 bg-zinc-800 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-24 text-zinc-500">
            <Users size={44} className="mx-auto mb-3 opacity-20" />
            <p className="text-lg font-medium">No community posts yet</p>
          </div>
        ) : (
          <div className="space-y-5">
            {sorted.map((recipe, index) => {
              const chef =
                recipe.createdBy?.username
                  ? {
                    name: recipe.createdBy.username,
                    role: "Food Enthusiast",
                    verified: false,
                    avatar: recipe.createdBy.avatar || null,
                  }
                  : getChefMeta(index);
              const isLiked = likedPosts[recipe._id];
              const isBookmarked = bookmarkedPosts[recipe._id];
              const isFeatured = index === 0;

              return (
                <article
                  key={recipe._id}
                  className="bg-[#111111] border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all duration-200"
                >
                  {/* Featured banner */}
                  {isFeatured && (
                    <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-5 py-2 flex items-center gap-2">
                      <Star
                        size={12}
                        fill="currentColor"
                        className="text-yellow-500"
                      />
                      <span className="text-xs font-semibold text-yellow-500 tracking-widest uppercase">
                        Featured
                      </span>
                    </div>
                  )}

                  <div className="flex gap-0">
                    {/* Image - left side, large */}
                    <div
                      className="w-[340px] shrink-0 overflow-hidden cursor-pointer"
                      onClick={() => navigate(`/recipes/${recipe._id}`)}
                    >
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover hover:scale-105 transition duration-500"
                        style={{ minHeight: "220px", maxHeight: "260px" }}
                      />
                    </div>

                    {/* Right content */}
                    <div className="flex-1 min-w-0 flex flex-col p-5">
                      {/* Chef row */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-yellow-500/30 to-orange-500/20 border-2 border-yellow-500/30 flex items-center justify-center shrink-0">
                            {chef.avatar ? (
                              <img
                                src={chef.avatar}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-bold text-yellow-500">
                                {chef.name[0].toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-semibold text-white">
                                {chef.name}
                              </span>
                              {chef.verified && (
                                <BadgeCheck
                                  size={15}
                                  className="text-yellow-500"
                                />
                              )}
                            </div>
                            <p className="text-xs text-zinc-500">{chef.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-zinc-600">
                            {getTimeAgo(index)}
                          </span>
                          <button className="text-zinc-600 hover:text-zinc-400 transition">
                            <MoreHorizontal size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h3
                        className="text-2xl font-bold text-white cursor-pointer hover:text-yellow-400 transition-colors mb-2"
                        onClick={() => navigate(`/recipes/${recipe._id}`)}
                      >
                        {recipe.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2 mb-4">
                        {recipe.description}
                      </p>

                      {/* Tags */}
                      <div className="flex items-center gap-2 mb-5 flex-wrap">
                        <span className="flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full">
                          <Clock size={11} />
                          {recipe.cookingTime} min
                        </span>
                        <span
                          className={`text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 ${getDifficultyColor(
                            recipe.difficulty
                          )}`}
                        >
                          <BarChart2 size={11} />
                          {recipe.difficulty || "Medium"}
                        </span>
                        <span className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-yellow-500/60" />
                          {recipe.category?.name || "General"}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="mt-auto flex items-center gap-5">
                        <button
                          onClick={(e) => toggleLike(recipe._id, e)}
                          className={`flex items-center gap-2 text-sm transition-all ${isLiked
                              ? "text-red-500"
                              : "text-zinc-500 hover:text-red-400"
                            }`}
                        >
                          <Heart
                            size={18}
                            fill={isLiked ? "currentColor" : "none"}
                          />
                          <span className="font-medium">
                            {getLikesCount(index)}
                          </span>
                        </button>

                        <button
                          onClick={() => navigate(`/recipes/${recipe._id}`)}
                          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-blue-400 transition"
                        >
                          <MessageCircle size={18} />
                          <span className="font-medium">
                            {getCommentsCount(index)}
                          </span>
                        </button>

                        <button className="flex items-center gap-2 text-sm text-zinc-500 hover:text-green-400 transition">
                          <Share2 size={18} />
                          <span className="font-medium">Share</span>
                        </button>

                        <button
                          onClick={(e) => toggleBookmark(recipe._id, e)}
                          className={`ml-auto transition-all ${isBookmarked
                              ? "text-yellow-500"
                              : "text-zinc-500 hover:text-yellow-400"
                            }`}
                        >
                          <Bookmark
                            size={18}
                            fill={isBookmarked ? "currentColor" : "none"}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── Right Sidebar ─── */}
      <div className="w-[280px] shrink-0 space-y-6 sticky top-0 h-screen overflow-y-auto no-scrollbar">
        {/* Top Chefs */}
        <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-white text-base">Top Chefs</h3>
            <button className="text-yellow-500 text-sm hover:text-yellow-400 transition font-medium">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {TOP_CHEFS.map((chef) => (
              <div key={chef.rank} className="flex items-center gap-3">
                <span className="text-xs text-zinc-600 font-bold w-6 shrink-0">
                  {chef.rank}
                </span>
                <img
                  src={chef.avatar}
                  alt={chef.name}
                  className="w-9 h-9 rounded-full object-cover border border-zinc-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-semibold text-white truncate">
                      {chef.name}
                    </p>
                    {chef.verified && (
                      <BadgeCheck
                        size={13}
                        className="text-yellow-500 shrink-0"
                      />
                    )}
                  </div>
                  <p className="text-xs text-zinc-500">{chef.role}</p>
                </div>
                <span className="text-xs text-zinc-400 font-medium shrink-0">
                  {chef.followers}
                  <br />
                  <span className="text-zinc-600 font-normal">Followers</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Trending This Week */}
        <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              Trending This Week{" "}
              <Flame size={16} className="text-orange-500" />
            </h3>
            <button className="text-yellow-500 text-sm hover:text-yellow-400 transition font-medium">
              View all
            </button>
          </div>
          <div className="space-y-3">
            {isLoading
              ? [...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex gap-3 animate-pulse"
                >
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-zinc-800 rounded w-3/4" />
                    <div className="h-3 bg-zinc-800 rounded w-1/2" />
                  </div>
                </div>
              ))
              : trendingThisWeek.map((recipe) => (
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
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-zinc-500 flex items-center gap-1">
                        <Clock size={10} />
                        {recipe.cookingTime} min
                      </span>
                      <span className="text-xs text-yellow-500 flex items-center gap-1">
                        <Star size={10} fill="currentColor" />
                        {recipe.averageRating > 0
                          ? recipe.averageRating.toFixed(1)
                          : "4.8"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-orange-400 shrink-0">
                    <Flame size={12} />
                    <span>
                      {(2.5 - trendingThisWeek.indexOf(recipe) * 0.4).toFixed(
                        1
                      )}
                      k
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
