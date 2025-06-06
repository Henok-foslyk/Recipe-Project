import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import RecipeCard from './RecipeCard';
import '../styles/RecipeList.css';
import '../styles/recipe.css';

export default function RecipeList({ recipes, loading }) {

    if (loading) {
        return (
            <div className="grid-container">
                {
                    (loading ? (
                        <div className="recipe-grid">
                            {[...Array(20)].map((_, i) => (
                                <div key={i} className="skeleton-card">
                                    <Skeleton height={150} />
                                </div>
                            ))}
                        </div>
                    ) : ("")
                    )
                }
            </div>
        );
    }

    if (!Array.isArray(recipes) || recipes?.length === 0) {
        return <div>No recipes found.</div>;
    }

    return (
        <div className="recipe-container">
            <div className="recipe-grid">
                {recipes.map((recipe) => (
                    <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                    />
                ))}
            </div>
        </div>
    );
}
