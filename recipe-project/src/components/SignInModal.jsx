import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button
} from '@mui/material';
import { useAuth } from '../AuthContext';

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

const SignInModal = ({ open, onClose }) => {
  const { signIn } = useAuth(); // <-- Get signIn function from context
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await signIn(form.username, form.password); // use AuthContext's signIn
      onClose(); // Close modal if successful
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h5" gutterBottom>Sign In</Typography>
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
          label="Password"
          name="password"
          type="password"
          margin="normal"
          value={form.password}
          onChange={handleChange}
        />
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, backgroundColor: '#9ecc1a', '&:hover': { backgroundColor: '#7ba809' } }}
          onClick={handleSubmit}
        >
          Login
        </Button>
      </Box>
    </Modal>
  );
};

export default SignInModal;
