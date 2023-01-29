import {
  AppBar,
  Box,
  CssBaseline,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";
import binhiIcon from "../Drawer/imgs/binhi-icon-sprout.png";

const Header = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar
            position="fixed"
            sx={{
              width: { sm: "100%" },
              ml: { sm: "100px" },
            }}
          >
            <Toolbar>
              <Typography variant="h6" noWrap component="div">
                <img alt="Binhi Icon" src={binhiIcon} />
                BINHI
              </Typography>
            </Toolbar>
          </AppBar>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: "100%" },
            }}
          >
            <Toolbar />
            <Typography paragraph></Typography>
            <Typography paragraph></Typography>
          </Box>
        </Box>
      </ThemeProvider>
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

export default Header;
