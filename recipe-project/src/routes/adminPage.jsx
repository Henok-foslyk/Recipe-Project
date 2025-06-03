import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  Spinner,
} from '@chakra-ui/react';


export default function AdminPage({ isAdmin }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);


  useEffect(() => {
    if (isAdmin) {
      fetchPendingRecipes();
    }
  }, [isAdmin]);

  const fetchPendingRecipes = async () => {
    try {
      const res = await fetch('/api/recipes/pending');
      const data = await res.json();
      setRecipes(data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    setVerifyingId(id);
    try {
      await fetch(`/api/recipes/verify/${id}`, {
        method: 'POST',
      });
      setRecipes(prev => prev.filter(recipe => recipe.id !== id));

    } catch (err) {

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
    <Box p={6}>
      <Heading mb={4}>Pending Recipes for Review</Heading>

      {loading ? (
        <Spinner />
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
              <Heading size="md">{recipe.title}</Heading>
              <Text mt={2}>{recipe.description}</Text>
              <Button
                mt={4}
                colorScheme="green"
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
  );
}
