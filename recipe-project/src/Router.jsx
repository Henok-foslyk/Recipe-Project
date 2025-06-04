import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Recipes from "./routes/Recipes";
import CreateRecipe from "./routes/CreateRecipe";
import AdminPage from "./routes/adminPage";
import MyRecipes from "./routes/MyRecipes";
import RecipeDetails from "./routes/RecipeDetails";

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/recipes", element: <Recipes /> },
  { path: "/displayrecipe", element: <RecipeDetails /> },
  { path: "/admin", element: <AdminPage /> },
  { path: "/create-recipe", element: <CreateRecipe /> },
  { path: "/my-recipes", element: <MyRecipes /> },
  { path: "/recipes/:id", element: <RecipeDetails /> },
]);
