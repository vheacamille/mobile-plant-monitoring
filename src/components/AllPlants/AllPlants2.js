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
  Badge,
  Dialog,
  DialogContent,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import StorageIcon from "@mui/icons-material/Storage";
import { Link } from "react-router-dom";
import plant from "./imgs/real-display-plant.png";
import seed from "./imgs/seed.png";
import { useState, useRef, useEffect } from "react";
import { getDatabase, ref, onValue, remove, push } from "firebase/database";
import firebaseDb from "../Database/firebaseDbConfig";
import DeleteModal from "./DeleteModal";

const AllPlants2 = () => {
  const [plants, setPlants] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
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
        if (checkIfPastExpectedHarvestDate(element.expectedHarvestDate)) {
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

    function checkIfPastExpectedHarvestDate(expectedHarvestDate) {
      let dateToday = new Date();
      let dateToRemovePlant = new Date(expectedHarvestDate);

      return (
        dateToday.getFullYear() === dateToRemovePlant.getFullYear() &&
        dateToday.getMonth() === dateToRemovePlant.getMonth()
      );
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

        let dateArchived = new Date();
        dateArchived.setUTCHours(dateArchived.getUTCHours() + 8);

        push(plantRef, {
          name: element.name,
          datePlanted: element.datePlanted.toString(),
          expectedHarvestDate: element.expectedHarvestDate.toString(),
          link: element.link,
          isAvailableForMonitoring: element.isAvailableForMonitoring,
          dateAdded: dateArchived.toUTCString(),
          reason: "Past expected harvest date",
          deletedBy: "BINHI System",
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
    dateEnd.setUTCHours(dateEnd.getUTCHours() + 8);

    let timeDifference = dateEnd.getTime() - dateStart.getTime();
    let millisecondsInADay = 1000 * 60 * 60 * 24;
    let daysBetween =
      Math.floor(timeDifference / millisecondsInADay) < 0
        ? 0
        : Math.floor(timeDifference / millisecondsInADay);

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

  const handleClickDialogOpen = (event) => {
    setDialogOpen(true);
  };

  const handleDialogClose = (event) => {
    setDialogOpen(false);
  };

  async function deletePlant(plantToRemove, reason, setCloseModal) {
    const db = getDatabase(firebaseDb);

    let plantsRef = await ref(
      db,
      "/FirebaseRegisteredPlants/" + plantToRemove.name
    );
    remove(plantsRef).then(() => {
      let updatedPlantList = [];
      updatedPlantList = plants.filter((plant) => {
        return plant.name !== plantToRemove.name;
      });

      setPlants(updatedPlantList);
      setAction("successDelete");
      setShowDeleteModal(true);
      setShowSuccessAlert(true);
      setCrudAction("deleted");

      archivePlant(plantToRemove, reason);
      handleClose("delete");
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    });
  }

  async function archivePlant(plantToRemove, reason) {
    const db = getDatabase(firebaseDb);
    let plantRef = await ref(db, "/PlantsArchive/");

    let dateArchived = new Date();
    dateArchived.setUTCHours(dateArchived.getUTCHours() + 8);

    push(plantRef, {
      name: plantToRemove.name,
      datePlanted: plantToRemove.datePlanted.toString(),
      expectedHarvestDate: plantToRemove.expectedHarvestDate.toString(),
      link: plantToRemove.link,
      isAvailableForMonitoring: plantToRemove.isAvailableForMonitoring,
      dateAdded: dateArchived.toUTCString(),
      reason,
      deletedBy: sessionStorage.getItem("userID"),
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

              <Grid item xs={5} sm={4} zeroMinWidth key={item.name}>
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
                              plant={item}
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
                              state={{ plant: item }}
                              disabled={
                                "longpress" === action ||
                                (item.name.toLowerCase() === "pechay" &&
                                  parseFloat(item.Moisture)) >= 20 ||
                                parseFloat(item.Moisture) === NaN
                              }
                              onClick={handleClickDialogOpen}
                            >
                              <Badge
                                badgeContent={
                                  item.name.toLowerCase() === "pechay" &&
                                  parseFloat(item.Moisture) < 20
                                    ? 1
                                    : 0
                                }
                                color="error"
                              >
                                <InvertColorsIcon />
                              </Badge>
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="secondary"
                              component={Link}
                              to={item.link}
                              disabled={
                                "longpress" === action || item.link === "#"
                              }
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
                          <Dialog onClose={handleDialogClose} open={dialogOpen}>
                            <DialogContent dividers>
                              <Typography gutterBottom>
                                <strong>
                                  Reminder! {item.name.toUpperCase()} needs to
                                  be watered.
                                </strong>
                              </Typography>
                              <Typography gutterBottom>
                                {item.name.toUpperCase()}'s moisture is below
                                the expected moisture set for this plant.
                              </Typography>
                            </DialogContent>
                          </Dialog>
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
