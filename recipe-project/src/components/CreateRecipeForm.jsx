import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc, arrayUnion, collection, addDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../AuthContext';
import {
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HEALTH_LABELS = [
  { name: 'Dairy-Free', color: '#C4FFF9' },
  { name: 'Gluten-Free', color: '#9CEAEF' },
  { name: 'Vegan', color: '#68D8D6' },
  { name: 'Vegetarian', color: '#3DCCC7' },
];

const MEAL_TYPE = [
  { name: 'Breakfast', color: '#F4E04D' },
  { name: 'Lunch', color: '#F2ED6F' },
  { name: 'Dinner', color: '#CEE397' },
  { name: 'Snack', color: '#8DB1AB' },
  { name: 'Teatime', color: '#8CA5BA' },
];

const DIET_LABELS = [
  { name: 'Balanced', color: '#FBC2B5' },
  { name: 'High-Fiber', color: '#FFA8A9' },
  { name: 'High-Protein', color: '#F786AA' },
  { name: 'Low-Carb', color: '#B8658F' },
  { name: 'Low-Fat', color: '#CDB2AB' },
  { name: 'Low-Sodium', color: '#C2A199' },
];

const CUISINE_TYPE = [
  { name: 'American', color: '#129FF8' },
  { name: 'Asian', color: '#84BCDA' },
  { name: 'Caribbean', color: '#ECC30B' },
  { name: 'Mexican', color: '#F37748' },
  { name: 'Italian', color: '#D56062' },
  { name: 'Indian', color: '#FFB627' },
  { name: 'Kosher', color: '#E3EBFF' },
  { name: 'Mediterranean', color: '#8DBDF6' },
];

const DragDropBox = styled(Box)(() => ({
  border: '2px dashed #9ecc1a',
  borderRadius: '10px',
  padding: '2rem',
  textAlign: 'center',
  color: '#aaa',
  backgroundColor: '#ffffff',
  cursor: 'pointer',
}));

const CreateRecipe = () => {
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [description, setDescription] = useState('');
  const [selectedHealthLabels, setSelectedHealthLabels] = useState([]);
  const [selectedMealtypes, setSelectedMealtypes] = useState([]);
  const [selectedDietLabels, setSelectedDietLabels] = useState([]);
  const [selectedCuisineType, setSelectedCuisineType] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [instructions, setInstructions] = useState('');
  const { currentUser } = useAuth();

  // Tracks whether user has tried to submit, for showing inline errors
  const [touchedSubmit, setTouchedSubmit] = useState(false);

  const toggleHealthLabels = (label) => {
    setSelectedHealthLabels((prev) =>
      prev.includes(label) ? prev.filter((a) => a !== label) : [...prev, label]
    );
  };

  const toggleMealtype = (meal) => {
    setSelectedMealtypes((prev) =>
      prev.includes(meal) ? prev.filter((a) => a !== meal) : [...prev, meal]
    );
  };

  const toggleDietLabels = (diet) => {
    setSelectedDietLabels((prev) =>
      prev.includes(diet) ? prev.filter((a) => a !== diet) : [...prev, diet]
    );
  };

  const toggleCuisineType = (cuisine) => {
    setSelectedCuisineType((prev) =>
      prev.includes(cuisine) ? prev.filter((a) => a !== cuisine) : [...prev, cuisine]
    );
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async () => {
    setTouchedSubmit(true);

    if (!recipeName.trim() || !ingredients.trim() || !instructions.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const ingredientsArray = ingredients
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const instructionsArray = instructions
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    try {
      const docRef = await addDoc(collection(db, 'recipes'), {
        name: recipeName.trim(),
        description: description.trim(),
        ingredients: ingredientsArray,
        healthLabels: selectedHealthLabels,
        mealType: selectedMealtypes,
        dietLabels: selectedDietLabels,
        cuisineType: selectedCuisineType,
        instructions: instructionsArray,
        isApproved: false,
        isEdemam: false,
        imgUrl: '', // Placeholder; update when image upload implemented
        comments: [],
        createdAt: Timestamp.now(),
        type: '',
      });

      if (currentUser && currentUser.id) {
        try {
          const userRef = doc(db, 'users', currentUser.id);
          await setDoc(userRef, {
            createdRecipe: arrayUnion(docRef.id),
          }, { merge: true });
        } catch (userUpdateError) {
          console.error("Error updating user's createdRecipe:", userUpdateError);
        }
      }

      // Clear form and reset touchedSubmit
      setRecipeName('');
      setIngredients('');
      setDescription('');
      setInstructions('');
      setSelectedHealthLabels([]);
      setSelectedMealtypes([]);
      setSelectedDietLabels([]);
      setSelectedCuisineType([]);
      setImageFile(null);
      setTouchedSubmit(false);

      toast.success('Recipe created successfully!');
    } catch (error) {
      console.error('Error adding recipe:', error);
      toast.error('Failed to create recipe. Please try again.');
    }
  };

  const isSubmitDisabled =
    !recipeName.trim() || !ingredients.trim() || !instructions.trim();

  return (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        padding: 4,
        width: '100%',
        maxWidth: '1600px',
        margin: 'auto',
        color: 'black',
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} />

      <Typography
        variant="h3"
        sx={{
          fontWeight: 'bold',
          paddingY: 3,
          mt: 10,
          fontFamily: 'cursive',
          paddingX: 25,
          fontSize: '4.5rem',
          color: '#154517',
        }}
      >
        Create Your Recipe
      </Typography>

      <Stack spacing={4}>
        {/* Recipe Name (required) */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography sx={{ minWidth: 150, fontWeight: 'bold' }}>
            Recipe Name *
          </Typography>
          <TextField
            fullWidth
            required
            placeholder="Enter recipe name"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            error={touchedSubmit && !recipeName.trim()}
            helperText={
              touchedSubmit && !recipeName.trim()
                ? 'Recipe name is required'
                : ''
            }
            variant="outlined"
            InputProps={{
              style: { backgroundColor: '#ffffff', color: 'black' },
            }}
            InputLabelProps={{
              style: { color: 'lightgray' },
            }}
          />
        </Stack>

        {/* Meal Type */}
        <Stack direction="row" spacing={2}>
          <Typography sx={{ minWidth: 150, fontWeight: 'bold' }}>
            Meal Type
          </Typography>
          <Box>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {MEAL_TYPE.map(({ name, color }) => (
                <Chip
                  key={name}
                  label={name}
                  onClick={() => toggleMealtype(name)}
                  sx={{
                    backgroundColor: color,
                    fontSize: '16px',
                    border:
                      selectedMealtypes.includes(name) && '2px solid black',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </Stack>

            <Stack direction="row" spacing={1} mt={2}>
              {selectedMealtypes.map((meal) => (
                <Chip
                  key={meal}
                  label={`${meal} ✕`}
                  onClick={() => toggleMealtype(meal)}
                  sx={{ backgroundColor: '#eee', color: 'black' }}
                />
              ))}
            </Stack>
          </Box>
        </Stack>

        {/* Diet Labels */}
        <Stack direction="row" spacing={2}>
          <Typography sx={{ minWidth: 150, fontWeight: 'bold' }}>
            Diet Labels
          </Typography>
          <Box>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {DIET_LABELS.map(({ name, color }) => (
                <Chip
                  key={name}
                  label={name}
                  onClick={() => toggleDietLabels(name)}
                  sx={{
                    backgroundColor: color,
                    fontSize: '16px',
                    border:
                      selectedDietLabels.includes(name) && '2px solid black',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </Stack>

            <Stack direction="row" spacing={1} mt={2}>
              {selectedDietLabels.map((diet) => (
                <Chip
                  key={diet}
                  label={`${diet} ✕`}
                  onClick={() => toggleDietLabels(diet)}
                  sx={{ backgroundColor: '#eee', color: 'black' }}
                />
              ))}
            </Stack>
          </Box>
        </Stack>

        {/* Health Labels */}
        <Stack direction="row" spacing={2}>
          <Typography sx={{ minWidth: 150, fontWeight: 'bold' }}>
            Health Labels
          </Typography>
          <Box>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {HEALTH_LABELS.map(({ name, color }) => (
                <Chip
                  key={name}
                  label={name}
                  onClick={() => toggleHealthLabels(name)}
                  sx={{
                    backgroundColor: color,
                    fontSize: '16px',
                    border:
                      selectedHealthLabels.includes(name) && '2px solid black',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </Stack>

            <Stack direction="row" spacing={1} mt={2}>
              {selectedHealthLabels.map((label) => (
                <Chip
                  key={label}
                  label={`${label} ✕`}
                  onClick={() => toggleHealthLabels(label)}
                  sx={{ backgroundColor: '#eee', color: 'black' }}
                />
              ))}
            </Stack>
          </Box>
        </Stack>

        {/* Cuisine Type */}
        <Stack direction="row" spacing={2}>
          <Typography sx={{ minWidth: 150, fontWeight: 'bold' }}>
            Cuisine Type
          </Typography>
          <Box>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {CUISINE_TYPE.map(({ name, color }) => (
                <Chip
                  key={name}
                  label={name}
                  onClick={() => toggleCuisineType(name)}
                  sx={{
                    backgroundColor: color,
                    fontSize: '16px',
                    border:
                      selectedCuisineType.includes(name) &&
                      '2px solid black',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </Stack>

            <Stack direction="row" spacing={1} mt={2}>
              {selectedCuisineType.map((cuisine) => (
                <Chip
                  key={cuisine}
                  label={`${cuisine} ✕`}
                  onClick={() => toggleCuisineType(cuisine)}
                  sx={{ backgroundColor: '#eee', color: 'black' }}
                />
              ))}
            </Stack>
          </Box>
        </Stack>

        {/* Recipe Description */}
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Typography sx={{ minWidth: 150, fontWeight: 'bold' }}>
            Description
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Write a short description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            InputProps={{
              style: { backgroundColor: '#ffffff', color: 'black' },
            }}
            InputLabelProps={{
              style: { color: 'lightgray' },
            }}
          />
        </Stack>

        {/* Ingredients (required) */}
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Typography sx={{ minWidth: 150, fontWeight: 'bold' }}>
            Ingredients *
          </Typography>
          <TextField
            fullWidth
            required
            multiline
            rows={4}
            placeholder="List ingredients (comma-delimited)..."
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            error={touchedSubmit && !ingredients.trim()}
            helperText={
              touchedSubmit && !ingredients.trim()
                ? 'Ingredients cannot be empty'
                : ''
            }
            InputProps={{
              style: { backgroundColor: '#ffffff', color: 'black' },
            }}
            InputLabelProps={{
              style: { color: 'lightgray' },
            }}
          />
        </Stack>

        {/* Instructions (required) */}
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Typography sx={{ minWidth: 150, fontWeight: 'bold' }}>
            Instructions *
          </Typography>
          <TextField
            fullWidth
            required
            multiline
            rows={4}
            placeholder="Write step-by-step instructions (comma-delimited)..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            error={touchedSubmit && !instructions.trim()}
            helperText={
              touchedSubmit && !instructions.trim()
                ? 'Instructions cannot be empty'
                : ''
            }
            InputProps={{
              style: { backgroundColor: '#ffffff', color: 'black' },
            }}
            InputLabelProps={{
              style: { color: 'lightgray' },
            }}
          />
        </Stack>

        {/* Image Upload */}
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Typography sx={{ minWidth: 150, fontWeight: 'bold' }}>
            Dish Picture
          </Typography>
          <Box sx={{ width: '100%' }}>
            <DragDropBox>
              <Typography>Drag and drop to insert image</Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id="recipe-image"
              />
              <label htmlFor="recipe-image" style={{ cursor: 'pointer' }}>
                <Typography
                  variant="body2"
                  sx={{ mt: 1, color: '#9ecc1a', fontWeight: 500 }}
                >
                  Click to upload
                </Typography>
              </label>
              {imageFile && (
                <Typography sx={{ mt: 1 }}>📸 {imageFile.name}</Typography>
              )}
            </DragDropBox>
          </Box>
        </Stack>

        {/* Submit Button */}
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          sx={{
            backgroundColor: isSubmitDisabled ? '#ccc' : '#9ecc1a',
            color: '#ffffff',
            alignSelf: 'flex-end',
            paddingX: 4,
            paddingY: 1.5,
            fontWeight: 'bold',
            fontSize: '1rem',
            '&:hover': {
              backgroundColor: isSubmitDisabled ? '#ccc' : '#88b818',
            },
          }}
        >
          Create Recipe
        </Button>
      </Stack>
    </Box>
  );
};

export default CreateRecipe;
       
