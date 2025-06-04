import React from 'react';
import { useEffect, useRef, useState} from 'react';
import Slider from 'react-slick';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import banner1 from '../assets/banner1.jpg';
import banner2 from '../assets/banner2.jpg';
import banner3 from '../assets/banner3.jpg';
import SignUpModal from './SignupModal';
import SignInModal from './SignInModal';

const images = [banner1, banner2, banner3];

const BannerSlider = () => {

  const [openSignUp, setOpenSignUp] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);

  const sliderRef = useRef();
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(0); // Force Slick to recalculate layout
    }
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    arrows: false,
  };

  return (
    <>
    <SignUpModal open={openSignUp} onClose={() => setOpenSignUp(false)} />
    <SignInModal open={openSignIn} onClose={() => setOpenSignIn(false)} />
      <Box sx={{ height: '50vh', width: '100vw', position: 'relative', overflow: 'hidden', m: 0, p: 0 }}>
      <Slider {...settings}>
        {images.map((img, index) => (
          <Box
            key={index}
            sx={{
              width: '100vw',
              height: '100vh',
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
      </Slider>

      {/* Overlay Card */}
      <Card
        sx={{
          position: 'absolute',
          top: '50%',
          left: '10%',
          transform: 'translateY(-50%)',
          width: { xs: '90%', sm: '60%', md: '50%' },
          height: '25vh',
          backgroundColor: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(6px)',
          p: 1,
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Welcome to ReciMe
          </Typography>
          <Typography variant="body2">
            Discover delicious recipes and share your culinary creations with our community.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={() => setOpenSignUp(true)}
              sx={{
                backgroundColor: 'rgba(220,220,220,0.5)',
                color: 'black',
                '&:hover': { backgroundColor: 'rgba(220,220,220,0.7)' },
              }}
            >
              Sign Up
            </Button>
            <Button
              variant="contained"
              onClick={() => setOpenSignIn(true)}
              sx={{
                backgroundColor: '#9ecc1a',
                color: 'white',
                '&:hover': { backgroundColor: '#7ba809' },
              }}
            >
              Sign In
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
    </>
    
  );
};

export default BannerSlider;
