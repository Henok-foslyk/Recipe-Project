// src/components/SignUpModal.jsx
import React, { useState } from 'react';
import axios from 'axios';

import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent
} from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

const SignUpModal = ({ open, onClose }) => {
  const [form, setForm] = useState({
    username: '',
    name: '',
    password: '',
    createdRecipe: [],
    savedRecipe: [],
    admin: false,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    console.log('User submitted:', form);
    try{
        axios.post('http://localhost:5050/users/seed', form);
    }catch(e){
        console.log("An error occured", e);
    }
    onClose(); 
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h5" gutterBottom>Sign Up</Typography>
        <TextField
          fullWidth
          label="Username"
          name="username"
          margin="normal"
          value={form.username}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Name"
          name="name"
          margin="normal"
          value={form.name}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          margin="normal"
          value={form.password}
          onChange={handleChange}
        />
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, backgroundColor: '#9ecc1a', '&:hover': { backgroundColor: '#7ba809' } }}
          onClick={handleSubmit}
        >
          Create Account
        </Button>
      </Box>
    </Modal>
  );
};

export default SignUpModal;
