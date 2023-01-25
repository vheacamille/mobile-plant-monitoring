import { Grid } from '@mui/material';
import React from 'react';
import '../../css/home.css';
import GardenCarousel from './GardenCarousel';

const HomePage = () => {
  return (
    <Grid container spacing={2} sx={{ padding: "10px" }}>
      <Grid item xl={2} lg={3} md={3} sm={4} zeroMinWidth>

      </Grid>
      <Grid item xl={10} lg={9} md={9} sm={8} zeroMinWidth sx={{ width: "100%" }}>
        <div>
          <div className="home">
            <h1>Welcome to Binhi!</h1>
            <GardenCarousel />
          </div>
        </div>
      </Grid>
    </Grid >

  )
}

export default HomePage