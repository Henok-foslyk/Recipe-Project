import { Box, Typography, Card, CardContent, CardMedia, Button, Grid } from '@mui/material';
import BannerSlider from "../components/BannerSlider";
import recipeImg from '../assets/banner1.jpg';

const Home = () => {
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
          {[1, 2, 3].map((_, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card sx={{ display: 'flex', flexDirection: 'row', height: 150 }}>
                <CardMedia
                  component="img"
                  image={recipeImg}
                  alt={`Recipe ${idx + 1}`}
                  sx={{ width: 120, height: '100%', objectFit: 'cover' }}
                />
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Typography variant="h6" sx={{ color: 'black' }}>Recipe Name</Typography>
                  <Typography variant="body2" sx={{ color: 'black' }}>
                    A short delicious summary of the recipe to get you excited...
                  </Typography>
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
              <Typography variant="h5">Add Your Own</Typography>
              <Typography variant="body2">Share your favorite dishes with the world.</Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

    </>
  );
};

export default Home;
