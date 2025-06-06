import { Box, Typography, Card, CardContent, CardMedia, Button, Grid } from '@mui/material';
import BannerSlider from "../components/BannerSlider";
import recipeImg from '../assets/banner1.jpg';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SaveButton from '../components/SaveButton';
import { Link } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [featuredRecipes, setFeaturedRecipes] = useState([]);

  useEffect(() => {
    const fetchFeaturedRecipes = async () => {
      try {
        const response = await fetch(`http://localhost:5050/recipes?q=pasta&count=3`);
        if (!response.ok) throw new Error('Failed to fetch featured recipes');
        const data = await response.json();
        setFeaturedRecipes(data.hits.slice(0, 3)); // Just 3 recipes
      } catch (error) {
        console.error('Error fetching featured recipes:', error);
      }
    };

    fetchFeaturedRecipes();
  }, []);

  return (
    <>
      <BannerSlider />


      <Box sx={{ px: 4, py: 6, backgroundColor: '#f9f9f9', width: '100%' }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'black', textAlign: 'center' }}>

          Featured Recipes
        </Typography>
        <Typography variant="body1" sx={{ color: 'black', mb: 3, textAlign: 'center' }}>
          Handpicked dishes you’ll love—from quick bites to gourmet meals.
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {featuredRecipes.map(({ recipe }, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card
                sx={{ display: 'flex', flexDirection: 'row', height: 150, cursor: 'pointer' }}
                onClick={() => window.open(recipe.url, '_blank')}
              >
                <CardMedia
                  component="img"
                  image={recipe.image}
                  alt={recipe.label}
                  sx={{ width: 120, height: '100%', objectFit: 'cover' }}
                />
                <CardContent
                  sx={{
                    flex: '1 0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    p: 2
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ color: 'black' }}>
                      {recipe.label}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'black', whiteSpace: 'pre-line' }}>
                      {recipe.cuisineType?.[0] && `Cuisine: ${recipe.cuisineType[0]}\n`}
                      {recipe.dishType?.[0] && `Dish: ${recipe.dishType[0]}\n`}
                    </Typography>
                  </Box>
                  <Box onClick={(e) => e.stopPropagation()}>
                    <SaveButton recipe={recipe} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>



      <Box sx={{ px: 4, py: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'black' }}>
          How it Works
        </Typography>
        <Typography variant="body1" sx={{ color: 'black', mb: 3 }}>
          Discover how to engage with the ReciMe community in two simple steps.
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card
              onClick={() => navigate('/recipes')}
              sx={{
                backgroundColor: '#7ba809',
                color: 'white',
                height: 200,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                '&:hover': {
                  backgroundColor: '#6e9908',
                  cursor: 'pointer',
                },
              }}
            >
              <Typography variant="h5">Browse Recipes</Typography>
              <Typography variant="body2">Explore community favorites and new ideas.</Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              onClick={() => navigate('/create-recipe')}
              sx={{
                backgroundColor: '#9ecc1a',
                color: 'white',
                height: 200,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                '&:hover': {
                  backgroundColor: '#89b615',
                  cursor: 'pointer',
                },
              }}
            >
              <Link to="/signup" >
                <div style={{ cursor: 'pointer' }}>
                  <Typography variant="h5">Add Your Own</Typography>
                  <Typography variant="body2">Share your favorite dishes with the world.</Typography>
                </div>
              </Link>
            </Card>
          </Grid>
        </Grid>
      </Box>

    </>
  );
};

export default Home;
