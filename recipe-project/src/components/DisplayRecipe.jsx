// src/components/DisplayRecipe.jsx
import React from "react";
import "./DisplayRecipe.css";

export default function DisplayRecipe({
  imageUrl = null,
  title = "Unknown Recipe",
  caution = "",
  ingredients = [],
  instructions = [],
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

          {/* Optional “caution” text */}
          {caution && (
            <p className="recipe-caution">
              <span>Caution:</span> {caution}
            </p>
          )}

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
