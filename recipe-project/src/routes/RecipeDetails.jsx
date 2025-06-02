// src/pages/RecipeDetails.jsx
import React from "react";
import DisplayRecipe from "../components/DisplayRecipe";
import "../components/RecipeDetails.css"; // ← import the wrapper’s CSS
import CommentsContainer from "../components/CommentsContainer";

export default function RecipeDetails() {
  return (
    <div className="cards-wrapper">
      <DisplayRecipe
        imageUrl="https://images.pexels.com/photos/4692163/pexels-photo-4692163.jpeg"
        title="Fat Sandwich"
        caution="XYZ, ABC, ETC."
        ingredients={["Lettuce", "Ground Beef", "Tomatoes"]}
        instructions={["bleh blah blah", "cook it"]}
      />
      <CommentsContainer />
    </div>
  );
}
