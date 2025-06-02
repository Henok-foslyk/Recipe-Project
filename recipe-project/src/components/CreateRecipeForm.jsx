import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const ALLERGENS = [
  { name: 'Dairy', color: '#FDE68A' },
  { name: 'Eggs', color: '#FACC15' },
  { name: 'Gluten', color: '#6EE7B7' },
  { name: 'Peanuts', color: '#F87171' },
  { name: 'Soy', color: '#A78BFA' },
];

const DragDropBox = styled(Box)(({ theme }) => ({
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
  const [imageFile, setImageFile] = useState(null);

  const toggleAllergen = (allergen) => {
    setSelectedAllergens((prev) =>
      prev.includes(allergen)
        ? prev.filter((a) => a !== allergen)
        : [...prev, allergen]
    );
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        padding: 4,
        maxWidth: '800px',
        margin: 'auto',
        color: 'black',
      }}
    >
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

        {/* Image Upload */}
        <Stack spacing={1} alignItems="center">
          <DragDropBox>
            <Typography>Drag and drop to insert recipe image</Typography>
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
        </Stack>

        {/* Submit Button */}
        <Button
          variant="contained"
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
    </Box>
  );
};

export default CreateRecipe;
