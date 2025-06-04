import React from "react";
import "../styles/recipe.css";
import Navbar from "../components/Navbar";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

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
      const myRecipes = collection(db, "recipes");
      const querySnapShot = await getDocs(myRecipes);
      const recipeList = querySnapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserRecipes(recipeList);
    } catch (error) {
      console.log("Error getting recipes: ", error);
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
      const loadFood = ["chicken", "pasta", "rice", "salad", "tofu", "beef", "soup", "fruits", "yam", "kenkey", "porridge"];

      // Use query if the user provides it, else we randomize default food
      const loadQuery =
        query || loadFood[Math.floor(Math.random() * loadFood.length)];
      params.append("q", loadQuery);

      // Append meal type and diet filters if set by user
      if (mealType) params.append("mealType", mealType);
      if (diet) params.append("diet", diet);
      if (health) params.append("health", health);
      if (cuisineType) params.append("cuisineType", cuisineType);

      const response = await fetch(
        `http://localhost:5050/recipes?${params.toString()}`
      );


      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const data = await response.json();
      setRecipes(data.hits || []);
    } catch (error) {
      console.log("Can't fetch recipes", error);
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

  /* returns the API calls, the different options and components */
  return (
    <>
      <Navbar />
      <div className="recipe-container">
        <h2>Search Recipes</h2>
        <div className="allButtons" >

          <div className="all-search">

            {/* Search input for recipes */}
            <input
              className="search-input"
              type="text"
              placeholder="Search recipes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { //if we click enter we can also get the recipes instead of clicking search button
                  getRecipes();
                }
              }}
            />

          {/* Dropdown to select meal type choices */}
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

        {/* Show skeleton loader when loading Edamame recipes*/}
        {!showUserRecipes &&
          (loading ? (
            <div className="recipe-grid">
              {[...Array(15)].map((_, i) => (
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
                  <a href={recipe.url} target="_blank" rel="noreferrer">
                    View Recipe
                  </a>
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
              {userRecipes.map((recipe, i) => (
                <Link
                  to={`/recipes/${recipe.id}`}
                  key={recipe.id}
                  style={{ textDecoration: "none" }}
                >
                  <div key={i} className="recipe-card">
                    <img
                      src={recipe.imgUrl || "/fallback-image.jpg"}
                      alt={recipe.name}
                    />
                    <h3>{recipe.name}</h3>
                    <p>{recipe.description}</p>
                    <p>Ingredients: {recipe.ingredients}</p>
                    <p>Instructions: {recipe.instructions}</p>
                  </div>
                </Link>
              ))}
            </div>
          ))}
      </div>
    </>
  );
}
