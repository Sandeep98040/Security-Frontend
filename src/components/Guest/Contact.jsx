import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import DOMPurify from 'dompurify';
import { ResponsiveAppBarLandingPage } from '../AppBar/ResponsiveAppBarLandingPage';

export const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Sanitize inputs
    const sanitizedData = {
      name: DOMPurify.sanitize(name),
      email: DOMPurify.sanitize(email),
      message: DOMPurify.sanitize(message),
    };

    // Basic validation
    if (!sanitizedData.name || !sanitizedData.email || !sanitizedData.message) {
      alert('All fields are required.');
      return;
    }

    // Send sanitizedData to the server or handle as needed
    console.log('Form submitted:', sanitizedData);

    // Reset form
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div style={styles.pageContainer}>
      <ResponsiveAppBarLandingPage />
      <Box sx={styles.formContainer}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={styles.title}>
          Contact Us
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={handleNameChange}
            sx={styles.textField}
            required
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            type="email"
            value={email}
            onChange={handleEmailChange}
            sx={styles.textField}
            required
          />
          <TextField
            label="Message"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={message}
            onChange={handleMessageChange}
            sx={styles.textField}
            required
          />
          <Button variant="contained" color="primary" type="submit" fullWidth sx={styles.submitButton}>
            Submit
          </Button>
        </form>
      </Box>
    </div>
  );
};

const styles = {
  pageContainer: {
    backgroundColor: '#e3f2fd',
    color: '#000000',
    minHeight: '100vh',
    padding: '20px',
  },
  formContainer: {
    maxWidth: '550px',
    margin: 'auto',
    marginTop: '20px',
    padding: '30px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontWeight: 'bold',
    color: '#1e88e5',
    marginBottom: '20px',
  },
  textField: {
    marginBottom: '20px',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#1e88e5',
      },
      '&:hover fieldset': {
        borderColor: '#1565c0',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1565c0',
      },
    },
  },
  submitButton: {
    backgroundColor: '#1e88e5',
    color: '#ffffff',
    padding: '10px 20px',
    '&:hover': {
      backgroundColor: '#1565c0',
    },
  },
};

export default Contact;
