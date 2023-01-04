import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  createTheme,
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
  const [lifeExpectancy, setLifeExpectancy] = useState(0);
  const [hasLifeExpectancyError, setHasLifeExpectancyError] = useState(false);
  const [areSensorsReady, setAreSensorsReady] = useState(false);
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

  const handleLifeExpectancyChange = (event) => {
    setLifeExpectancy(event.target.value);

    if (!isNaN(parseFloat(event.target.value))) {
      setHasLifeExpectancyError(false);
    } else {
      setHasLifeExpectancyError(true);
    }
  };

  const handleSensorsReadyChange = (event) => {
    setAreSensorsReady(event.target.checked);
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

    let isPlantNameTaken = plants.find((nameInDb) => {
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

    let isPastLifeExpectancy = checkIfPastLifeExpectancy(
      lifeExpectancy,
      plantedDate.toString()
    );

    if (isPastLifeExpectancy) {
      setAddResult("error");
      setAlertMessage(
        "Cannot add plant because it is past its life expectancy."
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

    set(plantRef, {
      name,
      datePlanted: plantedDateTime.toUTCString(),
      lifeExpectancy,
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
    setLifeExpectancy(0);
    setAreSensorsReady(false);
  }

  function checkIfPastLifeExpectancy(lifeExpectancyDate, datePlanted) {
    let lifeExpectancy = parseFloat(lifeExpectancyDate);
    let dateToday = new Date();
    let dateToRemovePlant = new Date(datePlanted);
    dateToRemovePlant.setMonth(dateToRemovePlant.getMonth() + lifeExpectancy);

    return dateToday >= dateToRemovePlant;
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
                  <FormControl>
                    <InputLabel
                      required
                      error={hasLifeExpectancyError}
                      htmlFor="component-outlined"
                    >
                      Life Expectancy (Months)
                    </InputLabel>
                    <OutlinedInput
                      required
                      error={hasLifeExpectancyError}
                      id="component-outlined"
                      value={lifeExpectancy}
                      onChange={handleLifeExpectancyChange}
                      label="Life Expectancy (Months)"
                      type="number"
                    />
                  </FormControl>
                  <br></br>
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
