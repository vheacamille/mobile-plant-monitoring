import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  createTheme,
  Dialog,
  DialogContent,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  OutlinedInput,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { getDatabase, ref, set } from "firebase/database";
import firebaseDb from "../Database/firebaseDbConfig";
import { useLocation } from "react-router-dom";

const ModifyPlant = ({ plant }) => {
  const location = useLocation();
  const data = location.state;
  const plantData = data.plant;

  const [name, setName] = useState(plantData.name);
  const [hasNameError, setHasNameError] = useState(false);
  const [plantedDate, setPlantedDate] = useState(plantData.datePlanted);
  const [expectedHarvestDate, setExpectedHarvestDate] = useState(
    plantData.expectedHarvestDate
  );
  const [expectedPhLevel, setExpectedPhLevel] = useState(
    plantData.expectedPhLevel
  );
  const [expectedMoisture, setExpectedMoisture] = useState(
    plantData.expectedMoisture
  );
  const [areSensorsReady, setAreSensorsReady] = useState(
    plantData.isAvailableForMonitoring
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modifyResult, setModifyResult] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleNameChange = (event) => {
    setName(event.target.value);
    if (event.target.value === "" || event.target.value === null) {
      setHasNameError(true);
    } else {
      setHasNameError(false);
    }
  };

  const handleSensorsReadyChange = (event) => {
    setAreSensorsReady(event.target.checked);
  };

  const handleExpectedPhLevelChange = (event) => {
    setExpectedPhLevel(event.target.value);
  };

  const handleExpectedMoistureChange = (event) => {
    setExpectedMoisture(event.target.value);
  };

  const handleClickDialogOpen = (event) => {
    setDialogOpen(true);
  };

  const handleDialogClose = (event) => {
    setDialogOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let isPastHarvestDate = checkIfPastExpectedHarvestDate(expectedHarvestDate);

    if (isPastHarvestDate) {
      setModifyResult("error");
      setAlertMessage("Invalid expected harvest date value.");
      setShowAlert(true);
      revertInputFields();
      setTimeout(() => {
        setShowAlert(false);
      }, 7000);

      return null;
    }

    const db = getDatabase(firebaseDb);
    const plantRef = await ref(db, "/FirebaseRegisteredPlants/" + name);

    let plantedDateTime = new Date(plantedDate);
    plantedDateTime.setUTCHours(plantedDateTime.getUTCHours() + 8);

    let expectedHarvestDateTime = new Date(expectedHarvestDate);
    expectedHarvestDateTime.setUTCHours(
      expectedHarvestDateTime.getUTCHours() + 8
    );

    set(plantRef, {
      name,
      datePlanted: plantedDateTime.toUTCString(),
      expectedHarvestDate: expectedHarvestDateTime.toUTCString(),
      expectedPhLevel,
      expectedMoisture,
      link: areSensorsReady ? "/plantDetails/" + name : "#",
      isAvailableForMonitoring: areSensorsReady,
    });

    setModifyResult("success");
    setAlertMessage("Successfully modified " + name);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 7000);
  };

  function revertInputFields() {
    setPlantedDate(plantData.datePlanted);
    setExpectedHarvestDate(plantData.expectedHarvestDate);
    setExpectedPhLevel(plantData.expectedPhLevel);
    setExpectedMoisture(plantData.expectedMoisture);
    setAreSensorsReady(plantData.isAvailableForMonitoring);
  }

  function checkIfPastExpectedHarvestDate(expectedHarvestDate) {
    let dateToday = new Date();
    let dateToRemovePlant = new Date(expectedHarvestDate);

    return (
      dateToday.getFullYear() > dateToRemovePlant.getFullYear() ||
      (dateToday.getFullYear() === dateToRemovePlant.getFullYear() &&
        dateToday.getMonth() >= dateToRemovePlant.getMonth())
    );
  }

  return (
    <>
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
                "& .MuiTextField-root": { m: 1, width: "25ch" },
                border: "1px solid #c8e6c9",
              }}
              autoComplete="off"
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="h5" component="div">
                Modify Plant Form
              </Typography>

              <CardContent>
                {showAlert && (
                  <>
                    <Alert severity={modifyResult}>{alertMessage}</Alert>
                    <br></br>
                  </>
                )}
                <ThemeProvider theme={theme}>
                  <FormControl>
                    <InputLabel
                      required
                      error={hasNameError}
                      htmlFor="component-outlined"
                    >
                      Name
                    </InputLabel>
                    <OutlinedInput
                      disabled
                      id="component-outlined"
                      value={name}
                      error={hasNameError}
                      onChange={handleNameChange}
                      label="Name"
                    />
                  </FormControl>
                  <br></br>
                  <br></br>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      shouldDisableYear={(year) => {
                        return year.$y < 2022 || year.$y > 2023;
                      }}
                      label="Date Planted"
                      openTo="year"
                      views={["year", "month", "day"]}
                      value={plantedDate}
                      onChange={(newValue) => {
                        setPlantedDate(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  <br></br>
                  <br></br>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      shouldDisableYear={(year) => {
                        return year.$y < 2022 || year.$y > 2023;
                      }}
                      label="Expected Harvest Date"
                      openTo="year"
                      views={["year", "month"]}
                      value={expectedHarvestDate}
                      onChange={(newValue) => {
                        setExpectedHarvestDate(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  <br></br>
                  <br></br>
                  <FormControl>
                    <InputLabel required htmlFor="component-outlined">
                      Expected pH Level
                    </InputLabel>
                    <OutlinedInput
                      required
                      id="expectedPhLevel"
                      type="number"
                      value={expectedPhLevel}
                      onChange={handleExpectedPhLevelChange}
                      label="Expected pH Level"
                    />
                  </FormControl>
                  <br></br>
                  <br></br>
                  <FormControl>
                    <InputLabel required htmlFor="component-outlined">
                      Expected Moisture (%)
                    </InputLabel>
                    <OutlinedInput
                      required
                      id="expectedMoisture"
                      type="number"
                      value={expectedMoisture}
                      onChange={handleExpectedMoistureChange}
                      label="Expected Moisture"
                    />
                  </FormControl>
                  <br></br>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={areSensorsReady}
                        onChange={handleSensorsReadyChange}
                      />
                    }
                    label="Sensors Ready?"
                  />
                  <br></br>
                  <br></br>
                  <Button
                    color="inherit"
                    variant="outlined"
                    size="small"
                    sx={{ fontSize: 10 }}
                    onClick={handleClickDialogOpen}
                  >
                    Click here to view the expected ph level and moisture for
                    your plant.
                  </Button>
                  <Dialog onClose={handleDialogClose} open={dialogOpen}>
                    <DialogContent dividers>
                      <Typography gutterBottom>
                        <strong>Expected ph Level and Moisture List</strong>
                      </Typography>
                      <Typography gutterBottom>
                        Pechay: (ph Level = 5.4 to 6.7, moisture = 30%)
                      </Typography>
                      <Typography gutterBottom>
                        Mustasa: (ph Level = 6.0 to 6.8, moisture = 40%)
                      </Typography>
                      <Typography gutterBottom>
                        Okra (ph Level = 5.8 - 6.8, moisture = 30%)
                      </Typography>
                      <Typography gutterBottom>
                        Sili (ph Level = 5.5 - 6.8, moisture = 60%)
                      </Typography>
                      <Typography gutterBottom>
                        Talong (ph Level = 5.5 - 6.8, moisture = 40%)
                      </Typography>
                      <Typography gutterBottom>
                        Sitaw (ph Level = 5.5 - 6.6, moisture = 40%)
                      </Typography>
                      <Typography gutterBottom>
                        Kamatis (ph Level = 5.8 - 6.5, moisture = 75%)
                      </Typography>
                      <Typography gutterBottom>
                        Upo (ph Level = 6.3, moisture = 40%)
                      </Typography>
                      <Typography gutterBottom>
                        Ampalaya (ph Level = 6.0 - 6.7, moisture = 80%)
                      </Typography>
                      <Typography gutterBottom>
                        Lettuce (ph Level = 6.0 - 6.5, moisture = 60%)
                      </Typography>
                      <Typography gutterBottom>
                        Kalabasa (ph Level = 6.0 - 6.7, moisture = 50%)
                      </Typography>
                    </DialogContent>
                  </Dialog>
                  <br></br>
                  <br></br>
                  <br></br>
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    fullWidth={true}
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Modify
                  </Button>
                </ThemeProvider>
              </CardContent>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={1} sm={3}>
          <Card />
        </Grid>
      </Grid>{" "}
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

export default ModifyPlant;
