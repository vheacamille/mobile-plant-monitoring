import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, styled, Typography, createTheme, ThemeProvider, Box} from "@mui/material";
import Paper from '@mui/material/Paper';
import pechay from './imgs/pechay.png'
import mustasa from './imgs/mustard-greens.png'
import okra from './imgs/okra.png'
import talong from './imgs/talong.png'
import sili from './imgs/sili.jpg'
import comingSoon from './imgs/coming-soon.png'

const AllPlants = () => {
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
      }));

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={1} sm={3}>
                    <Card />
                </Grid>
                <Grid item xs={5} sm={4} zeroMinWidth>
                    <Card sx={{ maxWidth: 345 }}>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                height="140"
                                image={pechay}
                                alt="pechay"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Pechay
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions style={{justifyContent: 'center'}}>
                            <ThemeProvider theme={theme}>
                                <Button size="small" variant="outlined" color="secondary">
                                    View Plant
                                </Button>
                            </ThemeProvider>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={5} sm={4} zeroMinWidth>
                    <Card sx={{ maxWidth: 345}}>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                height="140"
                                image={mustasa}
                                alt="mustasa"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Mustasa
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions style={{justifyContent: 'center'}}>
                            <Button size="small" variant="outlined" disabled>
                                View Plant
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={0} sm={1} zeroMinWidth>
                    <Card />
                </Grid>
                 <Grid item xs={1} sm={3}>
                    <Card />
                </Grid>
                <Grid item xs={5} sm={4} zeroMinWidth>
                    <Card sx={{ maxWidth: 345 }}>
                        <CardActionArea>
                            <CardMedia
                            component="img"
                            height="140"
                            image={okra}
                            alt="okra"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Okra
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions style={{justifyContent: 'center'}}>
                            <Button size="small" variant="outlined" disabled>
                                View Plant
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={5} sm={4} zeroMinWidth>
                    <Card sx={{ maxWidth: 345 }}>
                        <CardActionArea>
                            <CardMedia
                            component="img"
                            height="140"
                            image={talong}
                            alt="talong"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Talong
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions style={{justifyContent: 'center'}}>
                            <Button size="small" variant="outlined" disabled>
                                View Plant
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={0} sm={1} zeroMinWidth>
                    <Card />
                </Grid>
                 <Grid item xs={1} sm={3}>
                    <Card />
                </Grid>
                <Grid item xs={5} sm={4} zeroMinWidth>
                    <Card sx={{ maxWidth: 345 }}>
                        <CardActionArea>
                            <CardMedia
                            component="img"
                            height="140"
                            image={sili}
                            alt="sili"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Sili
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions style={{justifyContent: 'center'}}>
                            <Button size="small" variant="outlined" disabled>
                                View Plant
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={5} sm={4} zeroMinWidth>
                    <Card sx={{ maxWidth: 345 }}>
                        <CardActionArea>
                            <CardMedia
                            component="img"
                            height="140"
                            image={comingSoon}
                            alt="comingSoon"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Coming Soon
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions style={{justifyContent: 'center'}}>
                            <Button size="small" variant="outlined" disabled>
                                View Plant
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </>
    )
}

const theme = createTheme({
    palette: {
      primary: {
        main: '#81c784',
        light: '#c8e6c9'
      },
      secondary: {
        main: '#00a36e',
      },
    },
  });

export default AllPlants;