import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getRecipes = async (category, search, sort) => {
  const params = {};
  if (category && category !== "All") params.category = category;
  if (search) params.search = search;
  if (sort) params.sort = sort;
  const { data } = await axios.get(`${API_URL}/recipes`, { params });
  return data;
};

export const getRecipeById = async (id) => {
  const { data } = await axios.get(`${API_URL}/recipes/${id}`);
  return data;
};

export const getMyRecipes = async () => {
  const { data } = await axios.get(`${API_URL}/recipes/my-recipes`, {
    headers: getAuthHeader(),
  });
  return data;
};

export const createRecipe = async (formData) => {
  const { data } = await axios.post(`${API_URL}/recipes`, formData, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const updateRecipe = async (id, body) => {
  const { data } = await axios.put(`${API_URL}/recipes/${id}`, body, {
    headers: getAuthHeader(),
  });
  return data;
};

export const deleteRecipe = async (id) => {
  const { data } = await axios.delete(`${API_URL}/recipes/${id}`, {
    headers: getAuthHeader(),
  });
  return data;
};

export const addReview = async (id, body) => {
  const { data } = await axios.post(`${API_URL}/recipes/${id}/reviews`, body, {
    headers: getAuthHeader(),
  });
  return data;
};