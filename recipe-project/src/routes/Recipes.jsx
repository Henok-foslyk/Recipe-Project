import React from "react";
import "../styles/recipe.css";
import Navbar from "../components/Navbar";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SaveButton from "../components/SaveButton";
import fallbackImage from '../assets/fallbackImage.jpg';
import axios from 'axios';


export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // These are the filters chosen to use from the API doc
  const [mealType, setMealType] = useState("");
  const [diet, setDiet] = useState("");
  const [query, setQuery] = useState("");
  const [health, setHealth] = useState("");
  const [cuisineType, setCuisineType] = useState("");

  //help for toggle betweeen user and edamam recipes
  const [showUserRecipes, setShowUserRecipes] = useState(false);
  const [userRecipes, setUserRecipes] = useState([]);

  //get user recipes from firebase
  const fetchRecipes = async () => {
  setLoading(true);
  try {
    const response = await axios.get('http://localhost:5050/users/recipes/approved');
    setUserRecipes(response.data); // response.data should be an array of approved recipes
  } catch (error) {
    console.log("Error getting approved recipes: ", error);
    setUserRecipes([]);
  }
  setLoading(false);
};

  // Fetch recipes based on query, meal type, and diet filters
  const getRecipes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      // Randomized default food list for initial display so its not just 1 food
      const loadFood = [
        "chicken",
        "pasta",
        "rice",
        "salad",
        "tofu",
        "beef",
        "soup",
      ];

      // Use query if the user provides it, else we randomize default food
      const loadQuery =
        query || loadFood[Math.floor(Math.random() * loadFood.length)];
      params.append("q", loadQuery);

      // Append meal type and diet filters if set by user
      if (mealType) params.append("mealType", mealType);
      if (diet) params.append("diet", diet);
      if (cuisineType) params.append("cuisineType", cuisineType);
      if (health) params.append("health", health);

      const response = await fetch(
        `http://localhost:5050/recipes?${params.toString()}`
      );

      // Check for successful response or throw an error if failed
      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const data = await response.json();
      setRecipes(data.hits || []);
    } catch (error) {
      console.log("Can't fetch recipes", error); // Log any errors
      setRecipes([]);
    }
    setLoading(false);
  };

  // Load recipes
  useEffect(() => {
    if (showUserRecipes) {
      fetchRecipes();
    } else {
      getRecipes();
    }
  }, [showUserRecipes]);

  return (
    <>
      <Navbar />
      <div className="recipe-container">
        <h2>Search Recipes</h2>

        <div className="all-search">
          {/* Search input for recipes */}
          <input
            className="search-input"
            type="text"
            placeholder="Search recipes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* Dropdown to select meal type choices and others fields */}
          <select
            onChange={(e) => setMealType(e.target.value)}
            value={mealType}
          >
            <option value="">Select Meal Type</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snack">Snack</option>
            <option value="Teatime">Teatime</option>
          </select>

          <select onChange={(e) => setDiet(e.target.value)} value={diet}>
            <option value="">Select Diet</option>
            <option value="balanced">Balanced</option>
            <option value="high-protein">High-Protein</option>
            <option value="low-carb">Low-Carb</option>
            <option value="low-fat">Low-Fat</option>
            <option value="low-sodium">Low-Sodium</option>
            <option value="high-fiber">High-Fiber</option>
          </select>


          <select onChange={(e) => setHealth(e.target.value)} value={health}>
            <option value="">Select Health</option>
            <option value="dairy-free">Dairy-Free</option>
            <option value="gluten-free">Gluten-Free</option>
            <option value="vegan">Vegan</option>
            <option value="vegetarian">Vegetarian</option>
          </select>

          <select onChange={(e) => setCuisineType(e.target.value)} value={cuisineType}>
            <option value="">Select Cuisine Type</option>
            <option value="american">American</option>
            <option value="asian">Asian</option>
            <option value="caribbean">Caribbean</option>
            <option value="mexican">Mexican</option>
            <option value="italian"> Italian</option>
            <option value="indian"> Indian</option>
            <option value="kosher"> Kosher</option>
            <option value="mediterranean"> Mediterranean</option>
          </select>

          <button className="search" onClick={getRecipes}>Search</button>
        </div>

        {/* Toggle buttons to switch between Edamame recipes and user-created recipes */}
        <div className="toggle-buttons">
          <button
            className={showUserRecipes ? "" : "active"}
            onClick={() => setShowUserRecipes(false)}
          >
            Edamam Recipes
          </button>
          <button
            className={showUserRecipes ? "active" : ""}
            onClick={() => setShowUserRecipes(true)}
          >
            Community Recipes
          </button>
        </div>



      </div>


      <div className="grid-container">

        {/* Show skeleton loader when loading Edamame recipes*/}
        {!showUserRecipes &&
          (loading ? (
            <div className="recipe-grid">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <Skeleton height={150} />
                </div>
              ))}
            </div>
          ) : (
            // Display Edamame recipes when not loading
            <div className="recipe-grid">
              {recipes.length === 0 && <p>No recipes found.</p>}
              {recipes.map(({ recipe }, i) => (
                <div key={i} className="recipe-card">
                  <img src={recipe.image} alt={recipe.label} />
                  <h3>{recipe.label}</h3>
                  <p>Meal Type: {recipe.mealType?.join(", ")}</p>
                  <p>Diet Labels: {recipe.dietLabels?.join(", ")}</p>
                  <p>Cuisine Type: {recipe.cuisineType?.join(", ")}</p>
                  <a href={recipe.url} target="_blank" rel="noreferrer">
                    View Recipe
                  </a>
                  <SaveButton recipe={recipe}/>
                </div>
              ))}
            </div>
          ))}

        {/* Display user-created recipes when toggle is active and not loading */}
        {showUserRecipes &&
          (loading ? (
            <div className="recipe-grid">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <Skeleton height={150} />
                </div>
              ))}
            </div>
          ) : (
            //these are my recipes (from firebase) we can add more things if needed other than ingredients and insts.
            <div className="recipe-grid">
              {userRecipes.length === 0 && <p>No recipes found.</p>}
              {userRecipes.map((recipe) => (
                <div key={recipe.id} className="recipe-card">
                  {/*prevent infinite loop and faulty urls */}
                  <img
                    src={recipe.imgUrl || fallbackImage}
                    alt={recipe.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = fallbackImage;
                    }}
                  />
                  <h3>{recipe.name}</h3>
                  <p>Meal Type: {recipe.mealType?.join(", ")}</p>
                  <p>Diet Labels: {recipe.dietLabels?.join(", ")}</p>
                  <p>Cuisine Type: {recipe.cuisineType?.join(", ")}</p>
                  <Link
                    to={`/recipes/${recipe.id}`}
                  >
                    View Recipe
                  </Link>
                  <SaveButton recipeId={recipe.id}  />
                </div>
              ))}
            </div>
          ))}
      </div>
    </>
  );
}
