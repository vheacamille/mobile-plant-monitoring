import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  createTheme,
  ThemeProvider,
  ButtonGroup,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Link } from "react-router-dom";
import pechay from "./imgs/pechay.png";
import mustasa from "./imgs/mustard-greens.png";
import okra from "./imgs/okra.png";
import talong from "./imgs/talong.png";
import sili from "./imgs/sili.jpg";
import plant from "./imgs/plant-logo.png";
import { useState } from "react";

const AllPlants2 = () => {
  const plants = [
    { name: "Pechay", viewLink: "/plantDetails/Pechay", image: pechay },
    { name: "Mustasa", viewLink: "", image: mustasa },
    { name: "Okra", viewLink: "", image: okra },
    { name: "Talong", viewLink: "", image: talong },
    { name: "Sili", viewLink: "", image: sili },
    { name: "Sili", viewLink: "", image: sili },
  ];

  console.log(plants[0].name.toLowerCase());

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <Grid container spacing={2}>
        {plants.map((item, index) => {
          return (
            <>
              {index !== 0 && index % 2 === 0 && (
                <Grid item xs={0} sm={1} zeroMinWidth>
                  <Card />
                </Grid>
              )}

              {(index === 0 || index % 2 === 0) && (
                <Grid item xs={1} sm={3}>
                  <Card />
                </Grid>
              )}

              <Grid item xs={5} sm={4} zeroMinWidth>
                <Card sx={{ maxWidth: 345 }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image={plant}
                      alt={item.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {item.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions style={{ justifyContent: "center" }}>
                    <ThemeProvider theme={theme}>
                      <ButtonGroup
                        variant="text"
                        aria-label="outlined primary button group"
                        size="small"
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          color="secondary"
                          component={Link}
                          to={item.viewLink}
                        >
                          <DescriptionIcon />
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="secondary"
                          component={Link}
                          to={item.viewLink}
                        >
                          <BorderColorIcon />
                        </Button>
                      </ButtonGroup>
                    </ThemeProvider>
                  </CardActions>
                </Card>
              </Grid>
            </>
          );
        })}
      </Grid>
    </>
  );
};

const theme = createTheme({
  palette: {
    primary: {
      main: "#81c784",
      light: "#c8e6c9",
    },
    secondary: {
      main: "#00a36e",
    },
  },
});

export default AllPlants2;
