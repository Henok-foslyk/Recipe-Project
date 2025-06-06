// src/components/DisplayRecipe.jsx
import React from "react";
import "../styles/DisplayRecipe.css";   // ← This must match the CSS filename exactly
/*
          imageUrl={recipeData.imgUrl || "/fallback-image.jpg"}
          title={recipeData.name}
          caution={recipeData.healthLabels?.join(", ")}
          ingredients={recipeData.ingredients || []}
          instructions={recipeData.instructions || []}
          mealType={recipeData.mealType || []}
          cuisineType={recipeData.cuisineType || []}


*/
export default function DisplayRecipe({
  imageUrl = null,
  title = "Unknown Recipe",
  caution = "",
  ingredients = [],
  instructions = [],
  mealType = "",
  cuisineType = "",
  description = "",
}) {
  return (
    <div className="display-recipe-card">
      <div className="display-recipe-inner">
        {imageUrl && (
          <img
            className="recipe-image"
            src={imageUrl}
            alt={title}
          />
        )}

        <div className="recipe-body">
          {/* Recipe title */}
          <h2 className="recipe-title">{title}</h2>

          {description && (
            <p className="recipe-description">
              <span>Description:</span> {description}
            </p>
          )}
          {/* Optional “caution” text */}
          {caution && (
            <p className="recipe-caution">
              <span>Caution:</span> {caution}
            </p>
          )}
          {
            mealType && (
              <p className="recipe-meal-type">
                <span>Meal Type:</span> {mealType}
              </p>
            )
          }
          {
            cuisineType && (
              <p className="recipe-cuisine-type">
                <span>Cuisine Type:</span> {cuisineType}
              </p>
            )
          }

          {/* Cuisine type */}


          {/* Ingredients section */}
          <div className="recipe-section">
            <p className="section-heading">Ingredients:</p>
            <ul className="section-list">
              {ingredients.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Instructions section */}
          <div className="recipe-section">
            <p className="section-heading">Instructions:</p>
            <ol className="section-list">
              {instructions.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
