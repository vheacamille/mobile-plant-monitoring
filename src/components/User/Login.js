import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Avatar,
  Box,
  Button,
  createTheme,
  CssBaseline,
  Grid,
  Link,
  Paper,
  TextField,
  ThemeProvider,
  Typography
} from "@mui/material";
import React, { useState } from "react";
import Header from "./Header";

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

const Login = () => {
  // Form validation states
  const [emailError, setEmailError] = useState(null);
  const [emailErrorText, setEmailErrorText] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [passwordErrorText, setPasswordErrorText] = useState("");


  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    validateForm(data);

    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  function validateForm(data) {
    // Validate Email
    const email = data.get("email");
    if (!isValidEmail(email))
      setEmailError(true);
    else {
      setEmailError(false);
      setEmailErrorText("");
    }

    // Validate Password
    const password = data.get("password");
    if(!isValidPassword(password))
      setPasswordError(true);
    else {
      setPasswordError(false);
      setPasswordErrorText("");
    }
  }

  function isValidEmail(email) {
    if (email === null || email === "") {
      setEmailErrorText("Required!");
      return false;
    }

    const emailRegex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (!emailRegex.test(email)) {
      setEmailErrorText("Invalid email address!");
      return false;
    }

    return true;
  }

  function isValidPassword(password) {
    if(password.length < 8){
      setPasswordErrorText("Password must be atleast 8 characters");
      return false;
    }

    return true;
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Header />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url('/images/GardenCarousel2.jpg')",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "20%",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                error={emailError}
                helperText={emailErrorText}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={passwordError}
                helperText={passwordErrorText}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="/forgot" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/signUp" variant="body2">
                    Sign Up
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Login;
