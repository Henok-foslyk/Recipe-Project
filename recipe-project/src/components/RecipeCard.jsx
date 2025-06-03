import React from 'react';
import '../styles/RecipeCard.css';

export default function RecipeCard({ recipe, type, onDelete, onRemove, onEdit, onView }) {
  return (
    <div className="recipe-card" onClick={() => onView(recipe.id)}>
      <img src={recipe.image || '/default.png'} alt={recipe.title} className="recipe-img" />
      <h3>{recipe.title}</h3>
      <p>{recipe.description || 'Quick and healthy'}</p>
      <div className="recipe-actions">
        {type === 'created' ? ( // For MyRecipes
          <>
            <button onClick={(e) => { e.stopPropagation(); onEdit(recipe.id); }}>Edit</button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(recipe.id); }}>Delete</button>
          </>
        ) : type === 'saved' ? ( // For MyRecipes
          <button onClick={(e) => { e.stopPropagation(); onRemove(recipe.id); }}>
            Remove from Saved
          </button>
        ) : ( // For all other recipes (not user-created or saved)
          ""
        )}
      </div>
    </div>
  );
}
