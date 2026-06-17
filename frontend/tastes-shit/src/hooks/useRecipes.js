import { useQuery } from "@tanstack/react-query";
import { getRecipes, getRecipeById } from "../api/recipeApi";

export const useRecipes = (category, search, sort) => {
  return useQuery({
    queryKey: ["recipes", category ?? "All", search ?? "", sort ?? ""],
    queryFn: () => getRecipes(
      category && category !== "All" ? category : undefined,
      search || undefined,
      sort || undefined
    ),
  });
};

export const useRecipe = (id) => {
  return useQuery({
    queryKey: ["recipe", id],
    queryFn: () => getRecipeById(id),
    enabled: !!id,
  });
};