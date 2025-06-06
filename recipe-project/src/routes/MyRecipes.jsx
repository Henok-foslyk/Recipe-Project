import { useEffect, useState } from 'react';
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

                // Fetch fresh user document from Firestore to get updated created/saved Recipes
                const userRes = await fetch(`http://localhost:5050/users/${currentUser.id}`);
                const userData = await userRes.json();

                const createdResIDs = userData.createdRecipes || [];
                const savedRecipesData = userData.savedRecipes || [];

                const fetchRecipeById = async (id) => {
                    const res = await fetch(`http://localhost:5050/firebase-recipes?id=${id}`);
                    if (!res.ok) throw new Error(`Failed to fetch recipe with id ${id}`);
                    return res.json();
                };

                const createdRecipesData = await Promise.all(createdResIDs.map(fetchRecipeById));

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
                loading={isLoading}
            />
            </div>
        </>
    );
}
