// src/components/AboutUsPage.js
import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const AboutUsPage = () => {
  return (
    <Paper elevation={3} style={{ margin:60, padding: 20, marginTop: 20 }}>
    <Container maxWidth="sm">
      <Typography style={{ marginTop: '40px', color: '#555' }} variant="h4" align="center" gutterBottom>About Us</Typography>
      <Typography variant="body1" paragraph>
        We are a team of dedicated individuals from the CSDS branch, committed to delivering high-quality software solutions.
      </Typography>
      <Typography variant="h5" gutterBottom>Team Members</Typography>
      <Typography variant="body1" paragraph>
        <strong>Faisal Waris</strong> - Frontend Engineer
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Rohit Kumar</strong> - Report Developer
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Vishal Sharma</strong> - Backend Developer
      </Typography>
    </Container>
    </Paper>
  );
};

export default AboutUsPage;
