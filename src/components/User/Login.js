import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  Avatar,
  Box,
  Button,
  createTheme,
  CssBaseline,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Paper,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import bcrypt from "bcryptjs";
import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import firebaseDb from "../Database/firebaseDbConfig";
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
  const navigate = useNavigate();
  const [usersInDB, setUsersInDB] = useState(null);

  // Form validation states
  const [userIDError, setUserIDError] = useState(null);
  const [userIDErrorText, setUserIDErrorText] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [signUpResult, setSignUpResult] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (sessionStorage.getItem("refreshLogin") === "true") {
      window.location.reload(true);
      sessionStorage.removeItem("refreshLogin");
    }

    if (usersInDB === null) {
      getAllUsers();
    }
  });

  const getAllUsers = async () => {
    let users = [];
    const db = getDatabase(firebaseDb);
    const usersRef = await ref(db, "/FirebaseRegisteredUsers/");
    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        users = snapshot.val();
        setUsersInDB(users);
      }
    });
    return users;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const userInDB = usersInDB[data.get("userID")];

    validateForm(data);

    if (userInDB === null || userInDB === undefined) {
      setSignUpResult("error");
      setAlertMessage("Invalid User ID or Password");
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, 7000);

      return null;
    }

    const salt = userInDB.salt;
    const hashedPassword = bcrypt.hashSync(data.get("password"), salt);

    if (hashedPassword !== userInDB.password) {
      setSignUpResult("error");
      setAlertMessage("Invalid User ID or Password");
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, 7000);

      return null;
    }

    setUserIDError(false);
    setUserIDErrorText("");
    setPasswordError(false);

    sessionStorage.setItem("userID", data.get("userID"));
    sessionStorage.setItem("refreshHomePage", "true");
    navigate("/home");
  };

  function validateForm(data) {
    // Validate User ID
    const formUserID = data.get("userID");
    if (!isValidUserID(formUserID)) setUserIDError(true);
    else {
      setUserIDError(false);
      setUserIDErrorText("");
    }

    // Validate Password
    const password = data.get("password");

    if (!isValidPassword(password)) setPasswordError(true);
    else {
      setPasswordError(false);
    }
  }

  function isValidUserID(userID) {
    if (userID === null || userID === "") {
      setUserIDErrorText("Required!");
      return false;
    }

    const userIDRegex = /^[a-z0-9]+$/i;

    if (!userIDRegex.test(userID)) {
      setUserIDErrorText("Invalid User ID!");
      return false;
    }

    return true;
  }

  function isValidPassword(password) {
    if (password.length < 8) {
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
              {showAlert && (
                <>
                  <Alert sx={{ margin: "normal" }} severity={signUpResult}>
                    {alertMessage}
                  </Alert>
                  <br />
                </>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                id="userID"
                label="User ID"
                name="userID"
                autoComplete="userID"
                autoFocus
                error={userIDError}
                helperText={userIDErrorText}
              />
              <FormControl
                fullWidth
                sx={{ margin: "normal", marginTop: "10px" }}
                variant="outlined"
              >
                <InputLabel htmlFor="password" error={passwordError}>
                  Password
                </InputLabel>
                <OutlinedInput
                  id="password"
                  name="password"
                  error={passwordError}
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs sx={{ textAlign: "left" }}>
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
