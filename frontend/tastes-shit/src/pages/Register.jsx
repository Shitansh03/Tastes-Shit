import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChefHat, Mail, Lock, Eye, EyeOff, User, ArrowRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { registerUser, loginUser } from "../api/authApi";
import { useAuth } from "../components/auth/AuthContext";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData) => {
      // Step 1: Register the user
      await registerUser(formData);
      // Step 2: Login to get token + user data
      const loginRes = await loginUser({
        email: formData.email,
        password: formData.password,
      });
      // loginRes = { success, token, user: { _id, username, email, avatar, bio } }
      return loginRes;
    },
    onSuccess: (data) => {
      // data.user comes directly from the login response
      login(data.token, data.user);
      toast.success("Account created! Welcome to Chef's Vault 🎉");
      navigate("/");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Registration failed. Please try again.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    mutate(form);
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Left - Visual */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=900&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/40 to-black" />
        <div className="absolute bottom-12 left-12 right-12">
          <blockquote className="text-2xl font-serif text-white/90 leading-snug">
            "Share your passion for food with the world."
          </blockquote>
          <p className="text-zinc-400 mt-3 text-sm">100+ recipe categories to explore</p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-9 h-9 bg-yellow-500 rounded-xl flex items-center justify-center">
              <ChefHat size={20} className="text-black" />
            </div>
            <span className="text-xl font-bold">Chef's Vault</span>
          </Link>

          <h1 className="text-4xl font-bold mb-2">Create account</h1>
          <p className="text-zinc-400 mb-8 text-sm">Join thousands of food lovers today</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Username</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Your display name"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                  minLength={3}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-yellow-500 transition placeholder:text-zinc-600 text-sm"
                />
              </div>
            </div>

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
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={6}
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
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-zinc-500 mt-6 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-yellow-500 hover:text-yellow-400 font-medium transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
