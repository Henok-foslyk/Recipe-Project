import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Recipes from "./routes/Recipes";
import CreateRecipe from "./routes/CreateRecipe";
import AdminPage from "./routes/adminPage";
import MyRecipes from "./routes/MyRecipes";

export const router = createBrowserRouter([

  { path: "/", element: <App /> }, 
  { path: "/recipes", element: <Recipes /> },
  { path: "/admin", element: <AdminPage/>},
  { path: "/create-recipe", element: <CreateRecipe />},
  { path: "/my-recipes", element: <MyRecipes />}


]);
