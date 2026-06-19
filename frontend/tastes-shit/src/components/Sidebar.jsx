import {
  Home,
  ChefHat,
  Heart,
  PlusSquare,
  Grid3X3,
  Users,
  BookOpen,
  Compass,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Compass, label: "Explore", path: "/recipes" },
  { icon: Grid3X3, label: "Categories", path: "/categories" },
  { icon: Users, label: "Community", path: "/community" },
  { icon: Heart, label: "Favorites", path: "/favorites" },
  { icon: BookOpen, label: "My Recipes", path: "/my-recipes" },
];

const Sidebar = () => {
  return (
    <aside className="w-[72px] h-screen border-r border-zinc-800/60 bg-[#080808] hidden md:flex flex-col items-center py-5 shrink-0 overflow-hidden">
      <div className="mb-6">
        <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
          <ChefHat size={22} className="text-black" />
        </div>
      </div>

      <div className="flex flex-col gap-1 w-full px-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            title={item.label}
            className={({ isActive }) =>
              `w-full h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-200
              ${
                isActive
                  ? "bg-yellow-500/15 text-yellow-500 border border-yellow-500/20"
                  : "text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-200"
              }`
            }
          >
            <item.icon size={19} strokeWidth={1.8} />
            <span className="text-[9px] font-medium tracking-wide">{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="mt-auto px-2 w-full">
        <NavLink
          to="/create"
          title="Create Recipe"
          className={({ isActive }) =>
            `w-full h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-200 shadow-lg
            ${isActive
              ? "bg-yellow-500 text-black shadow-yellow-500/30"
              : "bg-yellow-500 hover:bg-yellow-400 text-black shadow-yellow-500/20 hover:shadow-yellow-500/40"
            }`
          }
        >
          <PlusSquare size={20} />
          <span className="text-[9px] font-bold">Create</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;