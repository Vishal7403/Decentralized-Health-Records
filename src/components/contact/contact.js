// src/components/ContactPage.js
import React from 'react';
import { Container, Typography, TextField, Button, Grid } from '@mui/material';

const ContactPage = () => {
  return (
    <Container maxWidth="sm">
      <Typography style={{ marginTop: '40px', color: '#555' }} variant="h4" align="center" gutterBottom>Contact Us</Typography>
      <form>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Name" variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Email" variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Message" variant="outlined" fullWidth multiline rows={4} />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default ContactPage;
