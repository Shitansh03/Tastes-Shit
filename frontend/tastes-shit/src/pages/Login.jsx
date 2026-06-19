import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChefHat, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/authApi";
import { useAuth } from "../components/auth/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      login(data.token, data.user);
      toast.success("Welcome back!");
      navigate("/");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Invalid email or password");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    mutate(form);
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-9 h-9 bg-yellow-500 rounded-xl flex items-center justify-center">
              <ChefHat size={20} className="text-black" />
            </div>
            <span className="text-xl font-bold">Chef's Vault</span>
          </Link>

          <h1 className="text-4xl font-bold mb-2">Welcome back</h1>
          <p className="text-zinc-400 mb-8 text-sm">
            Sign in to your account to continue cooking
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-yellow-500 transition placeholder:text-zinc-600 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-11 pr-12 py-3 outline-none focus:border-yellow-500 transition placeholder:text-zinc-600 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-zinc-500 mt-6 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-yellow-500 hover:text-yellow-400 font-medium transition">
              Create one
            </Link>
          </p>
        </div>
      </div>


      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/40 to-black" />
        <div className="absolute bottom-12 left-12 right-12">
          <blockquote className="text-2xl font-serif text-white/90 leading-snug">
            "Cooking is an art, and every recipe tells a story."
          </blockquote>
          <p className="text-zinc-400 mt-3 text-sm">Join thousands of home chefs</p>
        </div>
      </div>
    </div>
  );
};

export default Login;