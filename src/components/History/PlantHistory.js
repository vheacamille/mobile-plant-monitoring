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

          // Filter History to only return data from 3 Months ago to Present
          historyListDB = historyListDB.filter(data => {
            let archiveDate = new Date(data.dateAdded);
            let date3MonthsAgo = new Date();
            date3MonthsAgo.setMonth(date3MonthsAgo.getMonth() - 3);

            return archiveDate >= date3MonthsAgo;
          });

          // Sort History from latest to earliest
          historyListDB = historyListDB.sort((plant1, plant2) => {
            let date1 = new Date(plant1.dateAdded);
            let date2 = new Date(plant2.dateAdded);
            return date2 - date1;
          });

          setHistoryList(historyListDB);
        }
      });
    };

    getPlants();
  }, []);

  return (
    <div>
      <Grid container spacing={2} sx={{ padding: "20px" }}>
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
