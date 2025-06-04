import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import {
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';


const ALLERGENS = [
  { name: 'Dairy', color: '#C4FFF9' },
  { name: 'Eggs', color: '#9CEAEF' },
  { name: 'Gluten', color: '#68D8D6' },
  { name: 'Peanuts', color: '#3DCCC7' },
  { name: 'Soy', color: '#07BEB8' },
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
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [selectedMealtypes, setSelectedMealtypes] = useState([]);
  const [selectedDietLabels, setSelectedDietLabels] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [instructions, setInstructions] = useState('');


  const toggleAllergen = (allergen) => {
    setSelectedAllergens((prev) =>
      prev.includes(allergen)
        ? prev.filter((a) => a !== allergen)
        : [...prev, allergen]
    );
  };

  const toggleMealtype = (Mealtype) => {
    setSelectedMealtypes((prev) =>
      prev.includes(Mealtype)
        ? prev.filter((a) => a !== Mealtype)
        : [...prev, Mealtype]
    );
  };

  const toggleDietLabels = (dietLabel) => {
    setSelectedDietLabels((prev) =>
      prev.includes(dietLabel)
        ? prev.filter((a) => a !== dietLabel)
        : [...prev, dietLabel]
    );
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async () => {
    try {
      const docRef = await addDoc(collection(db, 'recipes'), {
        name: recipeName,
        description,
        ingredients,
        allergens: selectedAllergens,
        mealType: selectedMealtypes,
        dietLabels: selectedDietLabels,
        instructions,
        isApproved: false,
        isEdemam: false,
        imgUrl: '', // Placeholder, update this if uploading image
        comments: [],
        createdAt: Timestamp.now(),
        type: ''
      });

      console.log('Recipe saved with ID:', docRef.id);

      setRecipeName('');
      setIngredients('');
      setDescription('');
      setInstructions('');
      setSelectedAllergens([]);
      setSelectedMealtypes([]);
      setSelectedDietLabels([]);
      setImageFile(null);
    } catch (error) {
      console.error('Error adding recipe:', error);
    }
  };


  return (
    <>
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
        <Typography variant="h3" sx={{
          fontWeight: 'bold', paddingY: 3, mt: 10, fontFamily: 'cursive', paddingX: 25, fontSize: '4.5rem', color: '#154517'
        }}>
          Create Your Recipe
        </Typography>
        <Stack spacing={4}>
          {/* Recipe Name */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography sx={{ minWidth: 150, fontWeight: 'bold' }}>
              Recipe Name
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter recipe name"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
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
                      border:
                        selectedMealtypes.includes(name) && '2px solid black',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </Stack>

              <Stack direction="row" spacing={1} mt={2}>
                {selectedMealtypes.map((a) => (
                  <Chip
                    key={a}
                    label={`${a} ✕`}
                    onClick={() => toggleMealtype(a)}
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
                      border:
                        selectedDietLabels.includes(name) && '2px solid black',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </Stack>

              <Stack direction="row" spacing={1} mt={2}>
                {selectedDietLabels.map((a) => (
                  <Chip
                    key={a}
                    label={`${a} ✕`}
                    onClick={() => toggleDietLabels(a)}
                    sx={{ backgroundColor: '#eee', color: 'black' }}
                  />
                ))}
              </Stack>
            </Box>
          </Stack>

          {/* Allergens */}
          <Stack direction="row" spacing={2}>
            <Typography sx={{ minWidth: 150, fontWeight: 'bold' }}>
              Food Allergens
            </Typography>
            <Box>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {ALLERGENS.map(({ name, color }) => (
                  <Chip
                    key={name}
                    label={name}
                    onClick={() => toggleAllergen(name)}
                    sx={{
                      backgroundColor: color,
                      border:
                        selectedAllergens.includes(name) && '2px solid black',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </Stack>

              <Stack direction="row" spacing={1} mt={2}>
                {selectedAllergens.map((a) => (
                  <Chip
                    key={a}
                    label={`${a} ✕`}
                    onClick={() => toggleAllergen(a)}
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

          {/* Ingredients */}
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Typography sx={{ minWidth: 150, fontWeight: 'bold' }}>
              Ingredients
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="List ingredients..."
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              InputProps={{
                style: { backgroundColor: '#ffffff', color: 'black' },
              }}
              InputLabelProps={{
                style: { color: 'lightgray' },
              }}
            />
          </Stack>

          {/* Recipe Instructions */}
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Typography sx={{ minWidth: 150, fontWeight: 'bold' }}>
              Instructions
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Write step-by-step instructions..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
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
            sx={{
              backgroundColor: '#9ecc1a',
              color: '#ffffff',
              alignSelf: 'flex-end',
              paddingX: 4,
              paddingY: 1.5,
              fontWeight: 'bold',
              fontSize: '1rem',
              '&:hover': {
                backgroundColor: '#88b818',
              },
            }}
          >
            Create Recipe
          </Button>
        </Stack>
      </Box >
    </>
  );
};

export default CreateRecipe;
