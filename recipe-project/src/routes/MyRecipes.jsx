import { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeList from '../components/RecipeList';
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom';
import '../styles/myRecipes.css'; 
import { useAuth } from '../AuthContext';

export default function MyRecipes() {
    
    const [createdRecipes, setCreatedRecipes] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [isCreatedView, setIsCreatedView] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const { currentUser } = useAuth();

    useEffect(() => {
        if (!currentUser) return;
        const fetchRecipes = async () => {
        try {
            setIsLoading(true);
            //const userId = currentUser.id; // firebase auto-gen id
            const createdResIDs = currentUser.createdRecipe || [];
            const savedResIDs = currentUser.savedRecipe || [];

            // Function to fetch one recipe by ID
            const fetchRecipeById = async (id) => {
                const res = await fetch(`http://localhost:5050/firebase-recipes?id=${id}`);
                if (!res.ok) throw new Error(`Failed to fetch recipe with id ${id}`);
                return res.json();
            };

            // Fetch all created and saved recipes in parallel
            const [createdRecipesData, savedRecipesData] = await Promise.all([
                Promise.all(createdResIDs.map(fetchRecipeById)),
                Promise.all(savedResIDs.map(fetchRecipeById))
            ]);            
            
            setCreatedRecipes(createdRecipesData);
            setSavedRecipes(savedRecipesData);
            setIsLoading(false);
        } catch (err) {
            console.error('Failed to fetch recipes:', err);
        }
        };
        fetchRecipes();
    }, [currentUser]);
    
    return (
        <>
            <Navbar />

            {/* Header */}
            <div className="my-recipes-container">
            <h1 className='title' >My Recipes</h1>
            <p>Manage your created and saved recipes efficiently.</p>

            {/* Buttons */}
            <button className="create-recipe-btn" onClick={() => navigate('/create-recipe')}>
                Create Recipe
            </button>
            <div className="toggle-buttons">
                <button
                className={isCreatedView ? 'active-toggle' : ''}
                onClick={() => setIsCreatedView(true)}
                >
                Created Recipes
                </button>
                <button
                className={!isCreatedView ? 'active-toggle' : ''}
                onClick={() => setIsCreatedView(false)}
                >
                Saved Recipes
                </button>
            </div>

            {/* Content */}
            <h2 className='subtitle' >Your {isCreatedView ? 'Created' : 'Saved'} Recipes</h2>
            <p className='subsubtitle' >Here are the recipes you have {isCreatedView ? 'created' : 'saved'}.</p>

            <RecipeList
                recipes={isCreatedView ? createdRecipes : savedRecipes}
                type={isCreatedView ? 'created' : 'saved'}
                onDelete={async (id) => {
                await axios.delete(`/api/recipes/${id}`);
                setCreatedRecipes(prev => prev.filter(r => r.id !== id));
                }}
                onRemove={async (id) => {
                const userId = currentUser.id;
                await axios.delete(`/api/users/${userId}/savedRecipes/${id}`);
                setSavedRecipes(prev => prev.filter(r => r.id !== id));
                }}
                onEdit={(id) => navigate(`/edit/${id}`)}
                onView={(id) => navigate(`/recipe/${id}`)}
                loading={isLoading}
            />
            </div>
        </>
    );
}
