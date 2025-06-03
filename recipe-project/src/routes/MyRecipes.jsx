import { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeList from '../components/RecipeList';
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom';
import '../styles/myRecipes.css'; 

export default function MyRecipes() {
    
    const [createdRecipes, setCreatedRecipes] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [isCreatedView, setIsCreatedView] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecipes = async () => {
        try {
            setIsLoading(true);
            const userId = '123'; // replace with actual user ID logic
            const [createdRes, savedRes] = await Promise.all([
            axios.get(`/api/users/${userId}/createdRecipes`),
            axios.get(`/api/users/${userId}/savedRecipes`)
            ]);
            setCreatedRecipes(createdRes.data);
            setSavedRecipes(savedRes.data);
            setIsLoading(false);
        } catch (err) {
            console.error('Failed to fetch recipes:', err);
        }
        };
        fetchRecipes();
    }, []);

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
                const userId = '123';
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
