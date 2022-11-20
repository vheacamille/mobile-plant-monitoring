import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Modal,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  BasicCircle,
  HumidityDropPercent,
  TempLines,
} from "react-sensor-meters";
import { getDatabase, ref, onValue } from "firebase/database";
import firebaseDb from "../Database/firebaseDbConfig";
import { useParams } from "react-router-dom";

const PlantDetails = () => {
  const [humidity, setHumidity] = useState("0");
  const [temperature, setTemperature] = useState("0");
  const [moisture, setMoisture] = useState("0");
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const { plantName } = useParams();

  useEffect(() => {
    setHumidity("0");
    setTemperature("0");
    setMoisture("0");

    const getHumidity = async () => {
      const db = getDatabase(firebaseDb);
      const humidityRef = await ref(db, "/WaterLevel/WATER_LEVEL");
      onValue(humidityRef, (snapshot) => {
        if (snapshot.exists()) {
          setHumidity(parseFloat(JSON.stringify(snapshot.val())));
        } else {
          setHumidity(parseFloat("0"));
        }
      });
    };

    const getTemperature = async () => {
      const db = getDatabase(firebaseDb);
      const temperatureRef = await ref(db, "/WaterLevel/WATER_LEVEL");
      onValue(temperatureRef, (snapshot) => {
        if (snapshot.exists()) {
          setTemperature(parseFloat(JSON.stringify(snapshot.val())));
        } else {
          setTemperature(parseFloat("0"));
        }
      });
    };

    const getMoisture = async () => {
      const db = getDatabase(firebaseDb);
      const moistureRef = await ref(db, "/WaterLevel/WATER_LEVEL");
      onValue(moistureRef, (snapshot) => {
        if (snapshot.exists()) {
          setMoisture(parseFloat(JSON.stringify(snapshot.val())));
        } else {
          setMoisture(parseFloat("0"));
        }
      });
    };

    getHumidity();
    getTemperature();
    getMoisture();

    setOpen(plantName !== "Pechay");
  }, []);

  return (
    <>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Oops Plant Not Found!
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Sorry but only the Pechay plant is available for monitoring as of
              the moment.
            </Typography>
          </Box>
        </Modal>
      </div>
      {!open && (
        <Grid container spacing={2}>
          <Grid item xs={10} sm={5}>
            <Card />
          </Grid>
          <Grid item xs={10} sm={3}>
            <Typography gutterBottom variant="h6" component="div">
              {plantName} Details
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card />
          </Grid>
          <Grid item xs={2} sm={3}>
            <Card />
          </Grid>
          <Grid item xs={4} sm={4} zeroMinWidth>
            <div
              key={humidity}
              style={{
                margin: "auto",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <HumidityDropPercent
                data={humidity}
                topEndDataLimit={100}
                animate={true}
                neon={""}
                fillColor={"lightblue"}
                backFillColor={"linen"}
                valueColor={"black"}
                labelColor={"black"}
                cardColor={"white"}
                dotColor={"royalblue"}
                hover={false}
                gaugeSize={"small"}
                labelText={""}
                highFillColor={"dodgerblue"}
                highFillThreshold={95}
                borderColor={"lightGreen"}
              />
            </div>
            <Card sx={{ maxWidth: 345 }}>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h7" component="div">
                    Humidity %
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={5} sm={4} zeroMinWidth>
            <div
              key={temperature}
              style={{
                margin: "auto",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TempLines
                data={temperature}
                topEndDataLimit={100}
                animate={true}
                neon={""}
                fillColor={"lightcoral"}
                backFillColor={"whitesmoke"}
                valueColor={"black"}
                labelColor={"white"}
                cardColor={"white"}
                dotColor={"gold"}
                hover={false}
                gaugeSize={"small"}
                labelText={""}
                highFillColor={"crimson"}
                highFillThreshold={95}
              />
            </div>
            <Card sx={{ maxWidth: 345 }}>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h7" component="div">
                    Temperature °C
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={3} sm={4}>
            <Card />
          </Grid>
          <Grid item xs={1} sm={0}>
            <Card />
          </Grid>
          <Grid item xs={4} sm={3} zeroMinWidth>
            <div
              key={moisture}
              style={{
                margin: "auto",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <BasicCircle
                data={moisture}
                topEndDataLimit={100}
                animate={true}
                neon={""}
                fillColor={"steelblue"}
                backFillColor={"lightcyan"}
                valueColor={"black"}
                labelColor={"black"}
                cardColor={"white"}
                dotColor={"teal"}
                hover={false}
                gaugeSize={"small"}
                labelText={""}
                highFillColor={"dodgerblue"}
                highFillThreshold={80}
              />
            </div>
            <Card sx={{ maxWidth: 345 }}>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h7" component="div">
                    Moisture %
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={4} sm={1}>
            <Card />
          </Grid>
          <Grid item xs={4} sm={4}>
            <Card />
          </Grid>
        </Grid>
      )}
    </>
  );
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "#FFC0CB",
  border: "2px solid #000000",
  p: 4,
};

export default PlantDetails;
