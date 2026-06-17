import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const registerUser = async (body) => {
  const { data } = await axios.post(`${API_URL}/auth/register`, body);
  return data;
};

export const loginUser = async (body) => {
  const { data } = await axios.post(`${API_URL}/auth/login`, body);
  return data;
};

export const getMe = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token");
  const { data } = await axios.get(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const updateProfile = async (body) => {
  const token = localStorage.getItem("token");
  const { data } = await axios.put(`${API_URL}/auth/profile`, body, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const toggleFavorite = async (recipeId) => {
  const token = localStorage.getItem("token");
  const { data } = await axios.post(
    `${API_URL}/auth/favorites/${recipeId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};