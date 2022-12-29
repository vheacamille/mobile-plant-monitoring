import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  createTheme,
  ThemeProvider,
  ButtonGroup,
  Alert,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Link } from "react-router-dom";
import plant from "./imgs/plant-logo.png";
import seed from "./imgs/seed.png";
import { useState, useRef, useEffect } from "react";
import {
  getDatabase,
  ref,
  onValue,
  remove,
  set,
  push,
} from "firebase/database";
import firebaseDb from "../Database/firebaseDbConfig";
import dayjs from "dayjs";
import DeleteModal from "./DeleteModal";

const AllPlants2 = () => {
  const [plants, setPlants] = useState([]);
  const [plantNamesToRemove, setPlantNamesToRemove] = useState([]);
  const [archivedPlants, setArchivedPlants] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [crudAction, setCrudAction] = useState("");
  const [action, setAction] = useState("");

  const timerRef = useRef();
  const isLongPress = useRef();
  const longPressedItem = useRef();

  useEffect(() => {
    const getAllPlants = async () => {
      const db = getDatabase(firebaseDb);
      const plantsRef = await ref(db, "/FirebaseRegisteredPlants/");
      onValue(plantsRef, (snapshot) => {
        if (snapshot.exists()) {
          let dbValues = snapshot.val();
          let plantsInDb = Object.values(dbValues);
          identifyPlantsToRemoveAndArchive(plantsInDb);
          let updatedPlantList = [];
          updatedPlantList = plantsInDb.filter((plant) => {
            return !plantNamesToRemove.includes(plant.name);
          });

          plants.push("Add Plant");
          setPlants(updatedPlantList);
        }
      });
    };

    function identifyPlantsToRemoveAndArchive(plants) {
      let plantsToRemove = [];
      let plantsToArchive = [];

      for (const element of plants) {
        if (checkIfPastLifeExpectancy(element)) {
          plantsToRemove.push(element.name);
          plantsToArchive.push(element);
        }
      }

      if (
        JSON.stringify(plantNamesToRemove) !== JSON.stringify(plantsToRemove)
      ) {
        setPlantNamesToRemove(plantsToRemove);
        setArchivedPlants(plantsToArchive);
      }
    }

    function checkIfPastLifeExpectancy(plant) {
      let lifeExpectancy = parseFloat(plant.lifeExpectancy);
      let dateToday = new Date();
      let dateToRemovePlant = new Date(plant.datePlanted);
      dateToRemovePlant.setMonth(dateToRemovePlant.getMonth() + lifeExpectancy);

      return dateToday >= dateToRemovePlant;
    }

    const deletePlants = async () => {
      const db = getDatabase(firebaseDb);
      for (const element of plantNamesToRemove) {
        let plantsRef = await ref(db, "/FirebaseRegisteredPlants/" + element);
        remove(plantsRef);
      }
    };

    const archivePlants = async () => {
      const db = getDatabase(firebaseDb);

      for (const element of archivedPlants) {
        let plantRef = await ref(db, "/PlantsArchive/");

        push(plantRef, {
          name: element.name,
          datePlanted: element.datePlanted.toString(),
          lifeExpectancy: element.lifeExpectancy,
          link: element.link,
          isAvailableForMonitoring: element.isAvailableForMonitoring,
          dateAdded: dayjs(new Date()).toString(),
          reason: "Past life Expectancy",
        });
      }
    };

    getAllPlants();
    deletePlants();
    archivePlants();
  }, [plantNamesToRemove]);

  function handleOnClick() {
    if (isLongPress.current) {
      return;
    }

    setAction("click");
  }

  function handleOnMouseDown(e, plantItem) {
    startPressTimer(e, plantItem);
  }

  function handleOnMouseUp() {
    clearTimeout(timerRef.current);
  }

  function handleOnTouchStart(e, plantItem) {
    startPressTimer(e, plantItem);
  }

  function handleOnTouchEnd() {
    clearTimeout(timerRef.current);
  }

  function startPressTimer(e, plantItem) {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      longPressedItem.current = plantItem;
      setAction("longpress");
    }, 500);
  }

  function getDaysBetweenDates(dateStart, dateEnd) {
    let timeDifference = dateEnd.getTime() - dateStart.getTime();
    let millisecondsInADay = 1000 * 60 * 60 * 24;
    let daysBetween = Math.floor(timeDifference / millisecondsInADay);

    return daysBetween;
  }

  function handleClose(modalName) {
    if ("delete" === modalName) {
      setAction("closedModal");
      setShowDeleteModal(false);
    } else if ("success" === modalName) {
      setShowSuccessAlert(false);
    }
  }

  async function deletePlant(plantToRemove) {
    const db = getDatabase(firebaseDb);

    let plantsRef = await ref(db, "/FirebaseRegisteredPlants/" + plantToRemove);
    remove(plantsRef).then(() => {
      let updatedPlantList = [];
      updatedPlantList = plants.filter((plant) => {
        return plant.name !== plantToRemove;
      });

      setPlants(updatedPlantList);
      setAction("successDelete");
      setShowDeleteModal(true);
      setShowSuccessAlert(true);
      setCrudAction("deleted");
    });
  }

  return (
    <>
      <Grid container spacing={2}>
        {plants.map((item, index) => {
          return (
            <>
              {index === 0 && showSuccessAlert && (
                <>
                  {setTimeout(() => setShowSuccessAlert(false), 3000)}
                  <Grid item xs={0} sm={1} zeroMinWidth>
                    <Card />
                  </Grid>
                  <Grid item xs={1} sm={3}>
                    <Card />
                  </Grid>
                  <Grid item xs={5} sm={4} zeroMinWidth>
                    <Card>
                      <Alert severity="success">
                        Successfully {crudAction} {longPressedItem.current}{" "}
                      </Alert>
                    </Card>
                  </Grid>
                  <Grid item xs={1} sm={3}>
                    <Card />
                  </Grid>
                </>
              )}
              {index !== 0 && index % 2 === 0 && (
                <Grid item xs={0} sm={1} zeroMinWidth>
                  <Card />
                </Grid>
              )}

              {(index === 0 || index % 2 === 0) && (
                <Grid item xs={1} sm={3}>
                  <Card />
                </Grid>
              )}

              <Grid item xs={5} sm={4} zeroMinWidth>
                <Card
                  sx={{ maxWidth: 345 }}
                  onMouseDown={(e) => {
                    handleOnMouseDown(e, item.name);
                  }}
                  onMouseUp={handleOnMouseUp}
                  onTouchStart={(e) => {
                    handleOnTouchStart(e, item.name);
                  }}
                  onTouchEnd={handleOnTouchEnd}
                >
                  {"longpress" === action &&
                  longPressedItem.current === item.name ? (
                    <>
                      <CardActionArea
                        onClick={(e) => {
                          handleOnClick(e);
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="140"
                          image={plant}
                          alt={item.name}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            {item.name}
                          </Typography>
                          <Typography gutterBottom variant="h7" component="div">
                            Days Planted :{" "}
                            {getDaysBetweenDates(
                              new Date(item.datePlanted),
                              new Date()
                            )}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                      <CardActions style={{ justifyContent: "center" }}>
                        <ThemeProvider theme={theme}>
                          <ButtonGroup
                            variant="text"
                            aria-label="outlined primary button group"
                            size="small"
                          >
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              fullWidth={true}
                              onClick={(e) => {
                                setShowDeleteModal(true);
                              }}
                            >
                              <RemoveCircleOutlineIcon />
                            </Button>
                          </ButtonGroup>

                          {showDeleteModal && (
                            <DeleteModal
                              plantName={item.name}
                              isOpen={showDeleteModal}
                              closeModal={handleClose}
                              deletePlant={deletePlant}
                              key={showDeleteModal}
                            />
                          )}
                        </ThemeProvider>
                      </CardActions>
                    </>
                  ) : (
                    <>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="140"
                          image={plant}
                          alt={item.name}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            {item.name}
                          </Typography>
                          <Typography gutterBottom variant="h7" component="div">
                            Days Planted :{" "}
                            {getDaysBetweenDates(
                              new Date(item.datePlanted),
                              new Date()
                            )}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                      <CardActions style={{ justifyContent: "center" }}>
                        <ThemeProvider theme={theme}>
                          <ButtonGroup
                            variant="text"
                            aria-label="outlined primary button group"
                            size="small"
                          >
                            <Button
                              size="small"
                              variant="outlined"
                              color="secondary"
                              component={Link}
                              to={item.link}
                              disabled={"longpress" === action}
                            >
                              <DescriptionIcon />
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="secondary"
                              component={Link}
                              to={"/modifyPlant/" + item.name}
                              state={{ plant: item }}
                              disabled={"longpress" === action}
                            >
                              <BorderColorIcon />
                            </Button>
                          </ButtonGroup>
                        </ThemeProvider>
                      </CardActions>
                    </>
                  )}
                </Card>
              </Grid>
            </>
          );
        })}
        {plants.length % 2 === 0 && (
          <>
            <Grid item xs={0} sm={1} zeroMinWidth>
              <Card />
            </Grid>
            <Grid item xs={1} sm={3}>
              <Card />
            </Grid>
          </>
        )}
        <Grid item xs={5} sm={4} zeroMinWidth>
          <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image={seed}
                alt="Add Plant"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Add Plant
                </Typography>
                <Typography gutterBottom variant="h7" component="div">
                  Monitor your plants today!
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions style={{ justifyContent: "center" }}>
              <ThemeProvider theme={theme}>
                <ButtonGroup
                  variant="text"
                  aria-label="outlined primary button group"
                  size="small"
                >
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    component={Link}
                    to={"/addPlant/"}
                    disabled={"longpress" === action}
                  >
                    <AddCircleOutlineIcon />
                  </Button>
                </ButtonGroup>
              </ThemeProvider>
            </CardActions>
          </Card>
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
    error: {
      main: "#d32f2f",
    },
  },
});

export default AllPlants2;
