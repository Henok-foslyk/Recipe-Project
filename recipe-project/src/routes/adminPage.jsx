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

export default function AdminPage({ isAdmin }) {
  const [recipes, setRecipes] = useState([{ id: 1, name: "Grandma's Apple Pie", description: "Delicious classic apple pie." },
  { id: 2, name: "Spicy Tofu Stir-fry", description: "Quick and easy vegan recipe." }]);
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
        <Stack spacing={4}>
          {recipes.map((recipe) => (
            <Box
              key={recipe.id}
              borderWidth="1px"
              borderRadius="lg"
              p={4}
              boxShadow="md"
            >
              <Heading size="md" color="black">{recipe.name}</Heading>
              <Text mt={2}>{recipe.description}</Text>
              <Button
                mt={4}
                colorPalette="green"
                bg="green"
                color="white"
                _hover={
                  {bg: '#eee', color: 'green', fontWeight: 'bold'}
                }
                isLoading={verifyingId === recipe.id}
                onClick={() => handleVerify(recipe.id)}
              >
                Verify & Publish
              </Button>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
    </>
    
  );
}
