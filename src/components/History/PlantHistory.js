import { Grid } from "@mui/material";
import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import firebaseDb from "../Database/firebaseDbConfig";
import PlantHistoryTable from "./PlantHistoryTable";

const PlantHistory = () => {
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {

    const getPlants = async () => {
      const db = getDatabase(firebaseDb);
      const data = await ref(db, "/PlantsArchive/");
      onValue(data, (snapshot) => {
        if (snapshot.exists()) {
          let dbData = snapshot.val();
          let historyListDB = Object.values(dbData);
          console.log(historyListDB);

          // Filter History to only return data from 3 Months ago to Present
          historyListDB = historyListDB.filter(data => {
            let archiveDate = new Date(data.dateAdded);
            let date3MonthsAgo = new Date();
            date3MonthsAgo.setMonth(date3MonthsAgo.getMonth() - 3);

            return archiveDate >= date3MonthsAgo
          });

          setHistoryList(historyListDB);
        }
      });
    };

    getPlants();
  }, []);

  return (
    <div>
      <Grid container spacing={2} sx={{padding:"20px"}}>
        <Grid item xl={2} lg={3} md={3} sm={4} zeroMinWidth>

        </Grid>
        <Grid item xl={10} lg={9} md={9} sm={8} zeroMinWidth sx={{ width: "100%" }}>
          <div>
            <h1>Plant History</h1>
            <PlantHistoryTable historyList={historyList} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default PlantHistory;
