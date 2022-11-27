import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import MenuIcon from "@mui/icons-material/Menu";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import * as GiIcons from "react-icons/gi";
import OpacityIcon from "@mui/icons-material/Opacity";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import TimelineIcon from "@mui/icons-material/Timeline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material";
import { Link } from "react-router-dom";
import binhiIcon from "./imgs/binhi-icon-sprout.png";

const drawerWidth = 240;

function ResponsiveDrawerComp(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [tabIndex, setTabIndex] = React.useState(-1);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleTabIndex = (event, tabIndex) => {
    setTabIndex(tabIndex);
  };

  const listIcons = {
    Home: { index: 0, icon: <HomeIcon />, link: "/" },
    AddPlant: { index: 1, icon: <AddCircleIcon />, link: "/addPlant" },
    Plants: { index: 2, icon: <GiIcons.GiPlantSeed />, link: "/plants" },
    WaterPHLevel: { index: 3, icon: <OpacityIcon />, link: "/waterPhLevel" },
    LightMeter: { index: 4, icon: <LightbulbIcon />, link: "/lightMeter" },
    History: { index: 5, icon: <TimelineIcon />, link: "/history" },
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {[
          "Home",
          "Add Plant",
          "Plants",
          "Water PH Level",
          "Light Meter",
          "History",
        ].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              component={Link}
              to={listIcons[text.replace(/\s/g, "")].link}
              selected={tabIndex === listIcons[text.replace(/\s/g, "")].index}
              onClick={(event) => {
                handleTabIndex(event, listIcons[text.replace(/\s/g, "")].index);
              }}
              disableRipple={true}
            >
              <ListItemIcon>
                {listIcons[text.replace(/\s/g, "")].icon}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              <img alt="Binhi Icon" src={binhiIcon} />
              BINHI
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />
          <Typography paragraph></Typography>
          <Typography paragraph></Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

ResponsiveDrawerComp.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
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

export default ResponsiveDrawerComp;
