import { Search, Moon, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";

const Navbar = ({ searchValue, onSearchChange }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-zinc-800/60 px-6 flex items-center justify-between bg-black/95 backdrop-blur-sm sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="black">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
            <path d="M8 6c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v1H8V6z"/>
          </svg>
        </div>
        <span className="text-base font-bold tracking-tight">Chef's Vault</span>
      </Link>

      {/* Search + Actions */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-full w-52 hover:border-zinc-700 transition">
          <Search size={14} className="text-zinc-500 shrink-0" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchValue || ""}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="bg-transparent outline-none w-full text-sm placeholder:text-zinc-600 text-white"
          />
        </div>

        {/* Dark Mode Toggle */}
        <button className="w-9 h-9 flex items-center justify-center rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition">
          <Moon size={16} />
        </button>

        {/* Auth - Login button or Profile Avatar */}
        {user ? (
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 cursor-pointer"
            title={user.username}
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-9 h-9 rounded-full border-2 border-yellow-500/60 object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-500/30 to-orange-500/20 border-2 border-yellow-500/40 flex items-center justify-center text-yellow-500 font-bold text-sm">
                {user.username?.[0]?.toUpperCase()}
              </div>
            )}
          </button>
        ) : (
          <Link to="/login">
            <div className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200">
              <LogIn size={15} />
              Login
            </div>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
