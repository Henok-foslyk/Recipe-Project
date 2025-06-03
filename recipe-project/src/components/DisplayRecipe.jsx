// src/components/DisplayRecipe.jsx
import React from "react";
import "./DisplayRecipe.css";   // ← This must match the CSS filename exactly

export default function DisplayRecipe({
  imageUrl = null,
  title = "Fat Sandwich",
  caution = "XYZ, ABC, ETC.",
  ingredients = ["Lettuce", "Ground Beef", "Tomatoes"],
  instructions = ["bleh blah blah", "cook it"],
}) {
  return (
    <div className="display-recipe-card">
      {/* The inner wrapper that actually scrolls */}
      <div className="display-recipe-inner">
        {imageUrl && (
          <img
            className="recipe-image"
            src={imageUrl}
            alt={title}
          />
        )}

        <div className="recipe-body">
          <p className="recipe-title">{title}</p>
          <p className="recipe-caution">
            <span>Caution:</span> {caution}
          </p>

          <div className="recipe-section">
            <p className="section-heading">Ingredients:</p>
            <ul className="section-list">
              {ingredients.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

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
