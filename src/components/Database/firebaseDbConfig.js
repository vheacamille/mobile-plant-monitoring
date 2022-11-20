import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDyGaTS7DmJCM88RWdatDXRwnvrC3Tv9JI",
  authDomain: "plant-monitoring-test.firebaseapp.com",
  databaseURL:
    "https://plant-monitoring-test-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "plant-monitoring-test",
  storageBucket: "plant-monitoring-test.appspot.com",
  messagingSenderId: "552628922907",
  appId: "1:552628922907:web:0b07388f1cbb15bf9366be",
};

const firebaseDb = initializeApp(firebaseConfig);

export default firebaseDb;
