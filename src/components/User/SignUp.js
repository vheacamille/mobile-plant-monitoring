import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  createTheme,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import { getDatabase, onValue, ref, set } from "firebase/database";
import { useState } from "react";
import firebaseDb from "../Database/firebaseDbConfig";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [hasFirstNameError, setHasFirstNameError] = useState(false);
  const [lastName, setLastName] = useState("");
  const [hasLastNameError, setHasLastNameError] = useState(false);
  const [secQstn, setSecQstn] = useState("");
  const [hasSecQstnError, setHasSecQstnError] = useState(false);
  const [userID, setUserID] = useState("");
  const [hasUserIDError, setHasUserIDError] = useState(false);
  const [password, setPassword] = useState("");
  const [hasPasswordError, setHasPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasConfirmPasswordError, setHasConfirmPasswordError] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationResult, setRegistrationResult] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
    if (event.target.value === "" || event.target.value === null) {
      setHasFirstNameError(true);
    } else {
      setHasFirstNameError(false);
    }
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
    if (event.target.value === "" || event.target.value === null) {
      setHasLastNameError(true);
    } else {
      setHasLastNameError(false);
    }
  };

  const handleSecQstnChange = (event) => {
    setSecQstn(event.target.value);
    if (event.target.value === "" || event.target.value === null) {
      setHasSecQstnError(true);
    } else {
      setHasSecQstnError(false);
    }
  };

  const handleUserIDChange = (event) => {
    setUserID(event.target.value);
    if (event.target.value === "" || event.target.value === null) {
      setHasUserIDError(true);
    } else {
      setHasUserIDError(false);
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (event.target.value === "" || event.target.value === null) {
      setHasPasswordError(true);
    } else if (event.target.value.length < 8) {
      setHasPasswordError(true);
    } else {
      setHasPasswordError(false);
    }
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    if (event.target.value === "" || event.target.value === null) {
      setHasConfirmPasswordError(true);
    } else if (event.target.value.length < 8) {
      setHasConfirmPasswordError(true);
    } else {
      setHasConfirmPasswordError(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const users = await getAllUsers();

    const isValidUserID = /^[a-z0-9]+$/i.test(userID);

    if (
      userID === "" ||
      userID === null ||
      userID.length < 4 ||
      !isValidUserID
    ) {
      setRegistrationResult("error");
      setAlertMessage(
        "Invalid User ID. Make sure that there are no special characters in your chosen User ID."
      );
      setShowAlert(true);
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

      clearInputFields();
      setTimeout(() => {
        setShowAlert(false);
      }, 7000);

      return null;
    }

    if (password === "" || password === null || password.length < 8) {
      setRegistrationResult("error");
      setAlertMessage("Invalid Password");
      setShowAlert(true);
      clearInputFields();
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

      setTimeout(() => {
        setShowAlert(false);
      }, 7000);

      return null;
    }

    const isUserIDTaken = users.find((nameInDb) => {
      return nameInDb.toLowerCase() === userID.toLowerCase();
    });

    if (isUserIDTaken) {
      setRegistrationResult("error");
      setAlertMessage("The inputted User ID is already in use.");
      setShowAlert(true);
      clearInputFields();
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

      setTimeout(() => {
        setShowAlert(false);
      }, 7000);

      return null;
    }

    const isPasswordMismatched = password !== confirmPassword;

    if (isPasswordMismatched) {
      setRegistrationResult("error");
      setAlertMessage(
        "Invalid Password. Make sure it matches with the Confirm Password field."
      );
      setShowAlert(true);
      clearInputFields();
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

      setTimeout(() => {
        setShowAlert(false);
      }, 7000);

      return null;
    }

    const db = getDatabase(firebaseDb);
    const userRef = await ref(db, "/FirebaseRegisteredUsers/" + userID);

    const salt = bcrypt.genSaltSync(10);
    const hashedSecAnswer = bcrypt.hashSync(secQstn.toLowerCase(), salt);
    const hashedPassword = bcrypt.hashSync(password, salt);

    set(userRef, {
      firstName,
      lastName,
      securityAnswer: hashedSecAnswer,
      userID,
      password: hashedPassword,
      salt,
    });

    setRegistrationResult("success");
    setAlertMessage("Successfully registered user " + userID);
    setShowAlert(true);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    setTimeout(() => {
      setShowAlert(false);
      navigate("/login");
    }, 4000);

    clearInputFields();
  };

  const getAllUsers = async () => {
    let userIDs = [];
    const db = getDatabase(firebaseDb);
    const usersRef = await ref(db, "/FirebaseRegisteredUsers/");
    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        let dbValues = snapshot.val();
        userIDs = Object.keys(dbValues);
      }
    });

    return userIDs;
  };

  function clearInputFields() {
    setFirstName("");
    setLastName("");
    setSecQstn("");
    setUserID("");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <>
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
      <Grid container spacing={2}>
        <Grid item xs={0} sm={1} zeroMinWidth>
          <Card />
        </Grid>
        <Grid item xs={1} sm={3}>
          <Card />
        </Grid>
        <Grid item xs={9} sm={4} zeroMinWidth>
          <Card>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 1, width: "60ch" },
                border: "1px solid #c8e6c9",
              }}
              autoComplete="off"
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="h5" component="div">
                Sign Up
              </Typography>
              <CardContent>
                {showAlert && (
                  <>
                    <Alert severity={registrationResult}>{alertMessage}</Alert>
                    <br></br>
                  </>
                )}
                <ThemeProvider theme={theme}>
                  <FormControl>
                    <InputLabel
                      required
                      error={hasFirstNameError}
                      htmlFor="component-outlined"
                    >
                      First Name
                    </InputLabel>
                    <OutlinedInput
                      required
                      id="firstName"
                      value={firstName}
                      error={hasFirstNameError}
                      onChange={handleFirstNameChange}
                      label="First Name"
                    />
                  </FormControl>
                  <br></br>
                  <br></br>
                  <FormControl>
                    <InputLabel
                      required
                      error={hasLastNameError}
                      htmlFor="component-outlined"
                    >
                      Last Name
                    </InputLabel>
                    <OutlinedInput
                      required
                      id="lastName"
                      value={lastName}
                      error={hasLastNameError}
                      onChange={handleLastNameChange}
                      label="First Name"
                    />
                  </FormControl>
                  <br></br>
                  <br></br>
                  <FormControl>
                    <InputLabel
                      required
                      error={hasSecQstnError}
                      htmlFor="component-outlined"
                    >
                      Your Favorite Plant
                    </InputLabel>
                    <OutlinedInput
                      required
                      id="secQstn"
                      value={secQstn.toLowerCase()}
                      error={hasSecQstnError}
                      onChange={handleSecQstnChange}
                      label="Security Question"
                    />
                  </FormControl>
                  <br></br>
                  <br></br>
                  <FormControl>
                    <InputLabel
                      required
                      error={hasUserIDError}
                      htmlFor="userID"
                    >
                      User ID
                    </InputLabel>
                    <OutlinedInput
                      required
                      id="component-outlined"
                      value={userID}
                      error={hasUserIDError}
                      onChange={handleUserIDChange}
                      label="User ID"
                    />
                  </FormControl>
                  <br></br>
                  <br></br>
                  <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
                    <InputLabel
                      error={hasPasswordError}
                      htmlFor="outlined-adornment-password"
                    >
                      Password
                    </InputLabel>
                    <OutlinedInput
                      required
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      error={hasPasswordError}
                      onChange={handlePasswordChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                  </FormControl>
                  <br></br>
                  <br></br>
                  <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
                    <InputLabel
                      error={hasConfirmPasswordError}
                      htmlFor="outlined-adornment-password"
                    >
                      Confirm Password
                    </InputLabel>
                    <OutlinedInput
                      required
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      error={hasConfirmPasswordError}
                      onChange={handleConfirmPasswordChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowConfirmPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Confirm Password"
                    />
                  </FormControl>
                  <br></br>
                  <br></br>
                  <Typography
                    variant="body2"
                    component="div"
                    sx={{ fontStyle: "italic" }}
                  >
                    For security purposes do NOT share your password and your
                    favorite plant's name!
                  </Typography>
                  <br></br>
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    fullWidth={true}
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Sign Up
                  </Button>
                </ThemeProvider>
              </CardContent>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={0} sm={1} zeroMinWidth>
          <Card />
        </Grid>
        <Grid item xs={1} sm={3}>
          <Card />
        </Grid>
        <Grid item xs={0} sm={1} zeroMinWidth>
          <Card />
        </Grid>
        <Grid item xs={1} sm={3}>
          <Card />
        </Grid>
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

export default SignUp;
