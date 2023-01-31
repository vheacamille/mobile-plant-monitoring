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
import { useEffect, useState } from "react";
import firebaseDb from "../Database/firebaseDbConfig";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [usersInDB, setUsersInDB] = useState(null);
  const [userID, setUserID] = useState("");
  const [hasUserIDError, setHasUserIDError] = useState(false);
  const [secAnswer, setSecAnswer] = useState("");
  const [hasSecAnswerError, setHasSecAnswerError] = useState(false);
  const [password, setPassword] = useState("");
  const [hasPasswordError, setHasPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasConfirmPasswordError, setHasConfirmPasswordError] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotPwResult, setForgotPwResult] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
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

  const handleUserIDChange = async (event) => {
    setUserID(event.target.value);
    if (event.target.value === "" || event.target.value === null) {
      setHasUserIDError(true);
    } else {
      setHasUserIDError(false);
    }
  };

  const handleSecAnswerChange = (event) => {
    setSecAnswer(event.target.value);
    if (event.target.value === "" || event.target.value === null) {
      setHasSecAnswerError(true);
    } else {
      setHasSecAnswerError(false);
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
    const userInDB = usersInDB[userID];

    if (userInDB === null || userInDB === undefined) {
      setForgotPwResult("error");
      setAlertMessage("User ID does not exist.");
      setShowAlert(true);
      clearInputFields();
      setTimeout(() => {
        setShowAlert(false);
      }, 7000);

      return null;
    }

    if (password === "" || password === null || password.length < 8) {
      setForgotPwResult("error");
      setAlertMessage("Invalid Password");
      setShowAlert(true);
      clearInputFields();
      setTimeout(() => {
        setShowAlert(false);
      }, 7000);

      return null;
    }

    const salt = userInDB.salt;
    const hashedSecAnswer = bcrypt.hashSync(secAnswer.toLowerCase(), salt);
    const isWrongSecAnswer = userInDB.securityAnswer !== hashedSecAnswer;

    if (isWrongSecAnswer) {
      setForgotPwResult("error");
      setAlertMessage(
        "Favorite Plant is not the same as the one provided during Sign Up."
      );
      setShowAlert(true);
      clearInputFields();
      setTimeout(() => {
        setShowAlert(false);
      }, 7000);

      return null;
    }

    const isPasswordMismatched = password !== confirmPassword;

    if (isPasswordMismatched) {
      setForgotPwResult("error");
      setAlertMessage(
        "Invalid Password. Make sure it matches with the Confirm Password field."
      );
      setShowAlert(true);
      clearInputFields();

      setTimeout(() => {
        setShowAlert(false);
      }, 7000);

      return null;
    }

    const db = getDatabase(firebaseDb);
    const userRef = await ref(db, "/FirebaseRegisteredUsers/" + userID);

    const hashedPassword = bcrypt.hashSync(password, salt);

    set(userRef, {
      firstName: userInDB.firstName,
      lastName: userInDB.lastName,
      securityAnswer: hashedSecAnswer,
      userID,
      password: hashedPassword,
      salt,
    });

    setForgotPwResult("success");
    setAlertMessage("Successfully updated password for user " + userID);
    setShowAlert(true);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    setTimeout(() => {
      setShowAlert(false);
      navigate("/login");
    }, 4000);

    clearInputFields();
  };

  function clearInputFields() {
    setSecAnswer("");
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
                Forgot Password
              </Typography>
              <CardContent>
                {showAlert && (
                  <>
                    <Alert severity={forgotPwResult}>{alertMessage}</Alert>
                    <br></br>
                  </>
                )}
                <ThemeProvider theme={theme}>
                  <FormControl>
                    <InputLabel
                      required
                      error={hasSecAnswerError}
                      htmlFor="component-outlined"
                    >
                      Your Favorite Plant
                    </InputLabel>
                    <OutlinedInput
                      required
                      id="secAnswer"
                      value={secAnswer.toLowerCase()}
                      error={hasSecAnswerError}
                      onChange={handleSecAnswerChange}
                      label="Security Answer"
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
                      New Password
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
                      label="New Password"
                    />
                  </FormControl>
                  <br></br>
                  <br></br>
                  <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
                    <InputLabel
                      error={hasConfirmPasswordError}
                      htmlFor="outlined-adornment-password"
                    >
                      Confirm New Password
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
                      label="Confirm New Password"
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
                    Update Password
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

export default ForgotPassword;
