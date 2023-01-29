import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Alert,
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
  Typography,
} from "@mui/material";
import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import Header from "./Header";
import firebaseDb from "../Database/firebaseDbConfig";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";

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
  const [passwordErrorText, setPasswordErrorText] = useState("");
  const [signUpResult, setSignUpResult] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

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

    if (userInDB === null) {
      setSignUpResult("error");
      setAlertMessage("Invalid User ID or Password");
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, 7000);
    }

    const salt = userInDB.salt;
    const hashedPassword = bcrypt.hashSync(data.get("password"), salt);
    console.log("hash pass ", hashedPassword);
    console.log("passs ", userInDB.password);
    if (hashedPassword !== userInDB.password) {
      setSignUpResult("error");
      setAlertMessage("Invalid User ID or Password");
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, 7000);
    }

    setUserIDError(false);
    setUserIDErrorText("");
    setPasswordError(false);
    setPasswordErrorText("");

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
      setPasswordErrorText("");
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
      setPasswordErrorText("Invalid Password!");
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
            {showAlert && (
              <>
                <Alert severity={signUpResult}>{alertMessage}</Alert>
                <br></br>
              </>
            )}
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
                id="userID"
                label="User ID"
                name="userID"
                autoComplete="userID"
                autoFocus
                error={userIDError}
                helperText={userIDErrorText}
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
