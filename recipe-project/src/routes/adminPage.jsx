import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  Spinner,
} from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import fallbackImage from '../assets/fallbackImage.jpg';
import { Link } from "react-router-dom";
import '../styles/adminPage.css'

export default function AdminPage({ isAdmin }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);


  useEffect(() =>{
    fetchPendingRecipes();
  }, []);

  // useEffect(() => {
  //   if (isAdmin) {
  //     fetchPendingRecipes();
  //   }
  // }, [isAdmin]);

  const fetchPendingRecipes = async () => {
    try {
      const response = await axios.get('http://localhost:5050/users/recipes/unapproved');
      setRecipes(response.data);
    } catch (err) {
      console.error("ERROR: " + err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    setVerifyingId(id);
    try {
      await axios.patch(`http://localhost:5050/users/recipes/approveRequest/${id}`);
      setRecipes(prev => prev.filter(recipe => recipe.id !== id));
    } catch (err) {
      console.log("There was an error: ", err);
    } finally {
      setVerifyingId(null);
    }
  };

//   if (!isAdmin) {
//     return (
//       <Box p={6}>
//         <Text color="red.500" fontWeight="bold">
//           Access Denied. Admins only.
//         </Text>
//       </Box>
//     );
//   }

  return (
    <>
      <Navbar/>
      <Box p={6} margin={'20'}>
      <Heading mb={4}>Pending Recipes for Review</Heading>

      { loading ? (
        <Spinner color="black"/>
      ) : recipes.length === 0 ? (
        <Text>No recipes to review.</Text>
      ) : (
         <div className="recipe-grid">
            {recipes.length === 0 && <p>No recipes found.</p>}
            {recipes.map((recipe) => (
              <div key={recipe.id} className="recipe-card">
                {/* Prevent infinite loop and faulty urls */}
                <img
                  src={recipe.imgUrl || fallbackImage}
                  alt={recipe.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackImage;
                  }}
                />
                <h3>{recipe.name}</h3>
                <p>Meal Type: {recipe.mealType?.join(", ")}</p>
                <p>Diet Labels: {recipe.dietLabels?.join(", ")}</p>
                <p>Cuisine Type: {recipe.cuisineType?.join(", ")}</p>
                
                <div className="recipe-card-actions">
                  <Link to={`/recipes/${recipe.id}`}>
                    View Recipe
                  </Link>
                  <Button
                    colorPalette="green"
                    isLoading={verifyingId === recipe.id}
                    onClick={() => handleVerify(recipe.id)}
                  >
                    Verify & Publish
                  </Button>
                </div>
              </div>
            ))}
          </div>
      )}
    </Box>
    </>
    
  );
}
