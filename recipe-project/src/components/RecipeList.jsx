import React from 'react';
import RecipeCard from './RecipeCard';
import '../styles/RecipeList.css';

export default function RecipeList({ recipes, type, onDelete, onRemove, onEdit, onView }) {
    if (!Array.isArray(recipes)) {
        return <div>No recipes found.</div>;
      }
      
    return (
        <div className="recipe-list">
        {recipes.map((recipe) => (
            <RecipeCard
            key={recipe.id}
            recipe={recipe}
            type={type}
            onDelete={onDelete}
            onRemove={onRemove}
            onEdit={onEdit}
            onView={onView}
            />
        ))}
        </div>
    );
}
