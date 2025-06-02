import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./routes/Home";
import Recipes from "./routes/Recipes";
import CreateRecipe from "./routes/CreateRecipe";


export const router = createBrowserRouter([

  { path: "/", element: <App /> }, 
  { path: "/recipes", element: <Recipes /> },
  { path: "/home", element: <Home /> },
  { path: "/create.recipe", element: <CreateRecipe />}


]);
