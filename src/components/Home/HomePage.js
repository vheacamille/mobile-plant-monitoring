import { Grid } from "@mui/material";
import React, { useEffect } from "react";
import "../../css/home.css";
import GardenCarousel from "./GardenCarousel";

const HomePage = () => {
  useEffect(() => {
    if (sessionStorage.getItem("refreshHomePage") === "true") {
      window.location.reload(true);
      sessionStorage.removeItem("refreshHomePage");
    }
  });
  return (
    <Grid container spacing={1} sx={{ padding: "10px" }}>
      <Grid item xl={2} lg={3} md={3} sm={4}></Grid>
      <Grid
        item
        xl={10}
        lg={9}
        md={9}
        sm={8}
        zeroMinWidth
        sx={{ width: "100%" }}
      >
        <div>
          <div className="home">
            <GardenCarousel />
          </div>
        </div>
      </Grid>
    </Grid>
  );
};

export default HomePage;
