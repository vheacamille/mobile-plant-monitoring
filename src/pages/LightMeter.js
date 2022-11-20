import { Card, Grid, Paper, styled } from "@mui/material";
import { useState, useEffect } from "react";
import { LightThick } from "react-sensor-meters";
import { getDatabase, ref, onValue } from "firebase/database";
import firebaseDb from "../components/Database/firebaseDbConfig";

const LightMeter = () => {
  const [lightMeter, setLightMeter] = useState("0");
  const [timeUpdated, setTimeUpdated] = useState(getCurrentDateAndTime());

  // VCV: TEST ONLY. Replace with correct firebase
  useEffect(() => {
    setLightMeter("0");
    const getLightMeter = async () => {
      const db = getDatabase(firebaseDb);
      const lightMeterRef = await ref(db, "/WaterLevel/WATER_LEVEL");
      onValue(lightMeterRef, (snapshot) => {
        if (snapshot.exists()) {
          setLightMeter(parseFloat(JSON.stringify(snapshot.val())));
          setTimeUpdated(getCurrentDateAndTime());
        } else {
          setLightMeter(parseFloat("0"));
        }
      });
    };

    getLightMeter();
  }, []);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  // Data value was modified for display purposes only.
  let data = parseFloat(lightMeter) < 15 ? parseFloat(15) : lightMeter;

  return (
    <>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={0} sm={2} zeroMinWidth>
          <Card />
        </Grid>
        <Grid item xs={10} sm={6} zeroMinWidth sx={{ height: 400 }}>
          <div
            key={lightMeter}
            style={{
              margin: "auto",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <LightThick
              data={data}
              topEndDataLimit={114}
              animate={true}
              neon={""}
              fillColor={"yellow"}
              backFillColor={"lightgrey"}
              valueColor={"#F4F3F3"}
              labelColor={"black"}
              cardColor={"#FFFFFF"}
              dotColor={"black"}
              hover={false}
              gaugeSize={"medium"}
              labelText={parseFloat(lightMeter)}
            />
          </div>
          <Item>Current Light Meter Value as of {timeUpdated} </Item>
        </Grid>
      </Grid>
    </>
  );
};

function getCurrentDateAndTime() {
  const monthsOfTheYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let currentDate = new Date();

  let year = currentDate.getFullYear();
  let month = monthsOfTheYear[currentDate.getMonth()];
  let date = currentDate.getDate();

  let formattedDate = month + " " + date + ", " + year;

  let hours =
    currentDate.getHours() < 10
      ? "0" + currentDate.getHours()
      : "" + currentDate.getHours();
  let minutes =
    currentDate.getMinutes() < 10
      ? "0" + currentDate.getMinutes()
      : "" + currentDate.getMinutes();
  let seconds =
    currentDate.getSeconds() < 10
      ? "0" + currentDate.getSeconds()
      : "" + currentDate.getSeconds();

  let prepand = hours >= 12 ? " PM " : " AM ";

  if (hours === 0 && prepand === " PM ") {
    if (minutes === 0 && seconds === 0) {
      hours = 12;
      prepand = " Noon";
    } else {
      hours = 12;
      prepand = " PM";
    }
  }
  if (hours === 0 && prepand === " AM ") {
    if (minutes === 0 && seconds === 0) {
      hours = 12;
      prepand = " Midnight";
    } else {
      hours = 12;
      prepand = " AM";
    }
  }

  let formattedTime = hours + ":" + minutes + ":" + seconds + prepand;

  return formattedDate + " " + formattedTime;
}

export default LightMeter;
