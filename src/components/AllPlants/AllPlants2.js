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
} from "@mui/material";
import { Link } from "react-router-dom";
import pechay from "./imgs/pechay.png";
import mustasa from "./imgs/mustard-greens.png";
import okra from "./imgs/okra.png";
import talong from "./imgs/talong.png";
import sili from "./imgs/sili.jpg";
import plant from "./imgs/plant-logo.png";

const AllPlants2 = () => {
  const plants = [
    { name: "Pechay", link: "/plantDetails/Pechay", image: pechay },
    { name: "Mustasa", link: "", image: mustasa },
    { name: "Okra", link: "", image: okra },
    { name: "Talong", link: "", image: talong },
    { name: "Sili", link: "", image: sili },
    { name: "Sili", link: "", image: sili },
  ];

  console.log(plants[0].name.toLowerCase());
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
                      <Button
                        size="small"
                        variant="outlined"
                        color="secondary"
                        component={Link}
                        to={item.link}
                      >
                        View Plant
                      </Button>
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
