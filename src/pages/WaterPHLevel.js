import { Card, Grid, Paper, styled } from "@mui/material";
import { useState, useEffect } from "react";
import LiquidChart from "react-liquidchart";
import { getDatabase, ref, onValue } from "firebase/database";
import firebaseDb from "../components/Database/firebaseDbConfig";

const WaterPHLevel = () => {
  const [waterLevel, setWaterLevel] = useState("0");
  const [timeUpdated, setTimeUpdated] = useState(getCurrentDateAndTime());

  //VCV TEST CODE ONLY
  useEffect(() => {
    setWaterLevel("0");
    const getWaterLevel = async () => {
      const db = getDatabase(firebaseDb);
      const waterLevelRef = await ref(db, "/FirebaseIOT/humidity");
      onValue(waterLevelRef, (snapshot) => {
        if (snapshot.exists()) {
          setWaterLevel(parseFloat(JSON.stringify(snapshot.val())));
          setTimeUpdated(getCurrentDateAndTime());
        } else {
          setWaterLevel(parseFloat("0"));
        }
      });
    };

    getWaterLevel();
  }, []);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  return (
    <>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={0} sm={2} zeroMinWidth>
          <Card />
        </Grid>
        <Grid item xs={10} sm={6} zeroMinWidth sx={{ height: 400 }}>
          <LiquidChart
            responsive
            legend=""
            value={parseFloat(waterLevel)}
            showDecimal
            amplitude={4}
            frequency={2}
            animationTime={2000}
            animationWavesTime={2250}
            postfix="%"
            legendFontSize={0.1}
            gradient={{
              type: 1,
              x1: 0,
              x2: 0,
              y1: 100,
              y2: 0,
              stops,
            }}
          />
          <Item>Current Water PH Level (%) as of {timeUpdated} </Item>
        </Grid>
      </Grid>
    </>
  );
};

const stops = [
  <stop key={1} stopColor="#728FCE" offset="5%" />,
  <stop key={2} stopColor="#2B65EC" offset="50%" />,
  <stop key={3} stopColor="#659EC7" offset="85%" />,
];

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

export default WaterPHLevel;
