import React from 'react';
import '../styles/RecipeCard.css';
import fallbackImage from "../assets/fallbackImage.jpg"
import { Link } from "react-router-dom";

export default function RecipeCard({ recipe }) {

  return (
    <div key={recipe.id} className="recipe-card">
      <img
        src={recipe.img || fallbackImage}
        alt={recipe.title}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = fallbackImage;
        }}
      />
      <h3>{(recipe.title) ? `${recipe.title}` : `${recipe.name}`}</h3>
      <p>Meal Type: {recipe.mealType?.join(", ")}</p>
      <p>Diet Labels: {recipe.dietLabels?.join(", ")}</p>
      <p>Cuisine Type: {recipe.cuisineType?.join(", ")}</p>

      
      <Link
        to={
          (!recipe.isEdemam)
            ? `/recipes/${recipe.id}`
            : recipe.url // link to external recipe
        }
        target={(recipe.isEdemam) ? '_blank' : '_self'} // open in new tab for edemam
        rel="noopener noreferrer"
      >
        View Recipe
      </Link>


    </div>
  );
}
