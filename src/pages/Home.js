import { createTheme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Card } from '@mui/material';

const Home = () => {
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
                <Grid item xs={4}>
                    <Card />
                </Grid>
                <Grid item xs={4} zeroMinWidth>
                    <Item></Item>
                </Grid>
                <Grid item xs={4}>
                    <Card />
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
    MuiButton: {
      variants: [
        {
          props: { variant: 'openedTab' },
          style: {
            color: '#81c784',
          },
        }
      ]
    },
  });

export default Home;