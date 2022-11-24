import { createTheme, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Card, CardMedia } from "@mui/material";
import PlantDetails from "../components/Plant/PlantDetails";
import "./home.style.css";
import pechay from "../components/AllPlants/imgs/pechay.png";
import mustasa from "../components/AllPlants/imgs//mustard-greens.png";
import okra from "../components/AllPlants/imgs/okra.png";
import talong from "../components/AllPlants/imgs/talong.png";
import sili from "../components/AllPlants/imgs/sili.jpg";

const Home = () => {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#54C571" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  return (
    <>
      <Grid className="cardUI" container spacing={2}>
        <Grid item xs={4} className="cardUI">
          <Card className="cardUI" />
        </Grid>
        <Grid item xs={4} zeroMinWidthclassName="cardUI">
          <Item className="welcomecard text-center shadow">
            <h2 className="welcome">WELCOME TO</h2>
            <h1 className="binhi"> Binhi</h1>
            <div className="card text-center shadow">
              <div className="overflow">
                <CardMedia
                  className="cardmedia-img-top"
                  component="img"
                  height="100"
                  image={pechay}
                  alt="pechay"
                />
                <CardMedia
                  className="cardmedia-img-top"
                  component="img"
                  height="100"
                  image={mustasa}
                  alt="mustasa"
                />
                <CardMedia
                  className="cardmedia-img-top"
                  component="img"
                  height="100"
                  image={talong}
                  alt="talong"
                />
                <CardMedia
                  className="cardmedia-img-top"
                  component="img"
                  height="100"
                  image={okra}
                  alt="okra"
                />
                <CardMedia
                  className="cardmedia-img-top"
                  component="img"
                  height="100"
                  image={sili}
                  alt="sili"
                />
              </div>
            </div>
          </Item>
        </Grid>
        {/* <Grid item xs={4}>
          <Card />
        </Grid> */}
      </Grid>
    </>
  );
};

const theme = createTheme({
  palette: {
    primary: {
      main: "#54C571",
      light: "#54C571",
    },
    secondary: {
      main: "#54C571",
    },
  },
  MuiButton: {
    variants: [
      {
        props: { variant: "openedTab" },
        style: {
          color: "#54C571",
        },
      },
    ],
  },
});

export default Home;
