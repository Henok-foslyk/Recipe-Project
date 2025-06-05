import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import RecipeCard from './RecipeCard';
import '../styles/RecipeList.css';

export default function RecipeList({ recipes, type, onDelete, onRemove, onEdit, onView, loading }) {
    
    if (loading) {
        return (
            <div className="recipe-list">
                {[...Array(6)].map((_, index) => (
                    <div key={index} className="recipe-skeleton">
                        <Skeleton height={200} width={200} borderRadius={10} />
                        <Skeleton count={2} width={200} style={{ marginTop: '0.5rem' }} />
                    </div>
                ))}
            </div>
        );
    }

    if (!Array.isArray(recipes) || recipes.length === 0) {
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
