import React from 'react';
import { Typography, Button, Container, Paper, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import backgroundImage from '../assests/bg.jpg';

const containerStyle = {
  minHeight: '80vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  backgroundImage: `linear-gradient(to top, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.9)), url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: '16px', // Adjust padding as needed
};

const paperStyle = {
    padding: '40px',
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '10px',
  };

const headingStyle = {
    marginBottom: '20px',
    fontSize: '2.5rem',
    color: '#333',
  };
  
  const textStyle = {
    marginBottom: '30px',
    fontSize: '1.2rem',
    color: '#555',
  };

const buttonStyle = {
  textAlign: 'center',
};

const MainPage = () => {
  return (
    <div style={containerStyle}>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <Paper elevation={3} style={paperStyle}>
            <Typography variant="h3" style={headingStyle}>
              Decentralized Health Records
            </Typography>
            <Typography variant="body1" style={textStyle}>
              Gives patients full control over their health records and also allows them to grant or revoke a hospital's access to his/her records.
            </Typography>
            <div style={buttonStyle}>
              <Button
                component={Link}
                to={`/dashboard`}
                variant="contained"
                color="primary"
                style={{ fontWeight: 'bold' }}
              >
                Go to Dashboard
              </Button>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default MainPage;
