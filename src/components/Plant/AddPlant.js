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
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { getDatabase, onValue, ref, set } from "firebase/database";
import firebaseDb from "../Database/firebaseDbConfig";

const AddPlant = () => {
  const [name, setName] = useState("");
  const [hasNameError, setHasNameError] = useState(false);
  const [plantedDate, setPlantedDate] = useState(dayjs(new Date()));
  const [expectedHarvestDate, setExpectedHarvestDate] = useState(
    dayjs(new Date())
  );
  const [expectedPhLevel, setExpectedPhLevel] = useState(0);
  const [expectedMoisture, setExpectedMoisture] = useState(0);
  const [areSensorsReady, setAreSensorsReady] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addResult, setAddResult] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const getAllPlants = async () => {
    let plantsInDb = [];
    const db = getDatabase(firebaseDb);
    const plantsRef = await ref(db, "/FirebaseRegisteredPlants/");
    onValue(plantsRef, (snapshot) => {
      if (snapshot.exists()) {
        let dbValues = snapshot.val();
        plantsInDb = Object.values(dbValues);
        plantsInDb = plantsInDb.map((plants) => plants.name);
      }
    });

    return plantsInDb;
  };

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

    let plants = [];
    plants = await getAllPlants();

    if (name === "" || name === null) {
      setAddResult("error");
      setAlertMessage("Invalid Plant Name");
      setShowAlert(true);
      clearInputFields();
      setTimeout(() => {
        setShowAlert(false);
      }, 7000);

      return null;
    }

    let isPlantNameTaken =
      plants === null || JSON.stringify(plants) === "[null]"
        ? false
        : plants.find((nameInDb) => {
            return nameInDb.toLowerCase() === name.toLowerCase();
          });

    if (isPlantNameTaken) {
      setAddResult("error");
      setAlertMessage("Plant Name is already used! Consider using a new one.");
      setShowAlert(true);
      clearInputFields();
      setTimeout(() => {
        setShowAlert(false);
      }, 7000);

      return null;
    }

    let isPastHarvestDate = checkIfPastExpectedHarvestDate(expectedHarvestDate);

    if (isPastHarvestDate) {
      setAddResult("error");
      setAlertMessage(
        "Cannot add plant because of the invalid expected harvest date."
      );
      setShowAlert(true);
      clearInputFields();
      setTimeout(() => {
        setShowAlert(false);
      }, 7000);

      return null;
    }

    const db = getDatabase(firebaseDb);
    const plantRef = await ref(db, "/FirebaseRegisteredPlants/" + name);

    let plantedDateTime = plantedDate.toDate();
    plantedDateTime.setUTCHours(plantedDateTime.getUTCHours() + 8);

    let expectedHarvestDateTime = expectedHarvestDate.toDate();
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

    setAddResult("success");
    setAlertMessage("Successfully added " + name);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 7000);

    clearInputFields();
  };

  function clearInputFields() {
    setName("");
    setPlantedDate(dayjs(new Date()));
    setExpectedHarvestDate(dayjs(new Date()));
    setExpectedPhLevel(0);
    setExpectedMoisture(0);
    setAreSensorsReady(false);
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
                Add Plant Form
              </Typography>

              <CardContent>
                {showAlert && (
                  <>
                    <Alert severity={addResult}>{alertMessage}</Alert>
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
                      required
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
                      disableFuture
                      shouldDisableYear={(year) => {
                        return year.$y < 2022;
                      }}
                      label="Date Planted"
                      openTo="year"
                      views={["year", "month", "day"]}
                      value={plantedDate}
                      onChange={(newValue) => {
                        setPlantedDate(dayjs(newValue));
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
                        setExpectedHarvestDate(dayjs(newValue));
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
                    Add
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

export default AddPlant;
