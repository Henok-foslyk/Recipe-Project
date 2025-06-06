import React from 'react';
import '../styles/RecipeCard.css';

export default function RecipeCard({ recipe, type, onDelete, onRemove, onEdit, onView }) {
  return (
    <div className="recipe-card" onClick={() => onView(recipe.id)}>
      <img src={recipe.image || '/default.png'} alt={recipe.title} className="recipe-img" />
      <h3>{recipe.name}</h3>
      <p>{recipe.description || 'Quick and healthy'}</p>
      
    </div>
  );
}
