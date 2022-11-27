import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDccokTXR5Sp_YELjZapLC3JXyCWa57xXo",
  authDomain: "binhi-data.firebaseapp.com",
  databaseURL:
    "https://binhi-data-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "binhi-data",
  storageBucket: "binhi-data.appspot.com",
  messagingSenderId: "230988062905",
  appId: "1:230988062905:web:87c27e6122bb175ded7b68",
  measurementId: "G-LYKQD9RXP7",
};

const firebaseDb = initializeApp(firebaseConfig);

export default firebaseDb;
