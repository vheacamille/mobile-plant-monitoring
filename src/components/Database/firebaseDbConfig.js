// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDccokTXR5Sp_YELjZapLC3JXyCWa57xXo",
  authDomain: "binhi-data.firebaseapp.com",
  databaseURL:
    "https://binhi-data-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "binhi-data",
  storageBucket: "binhi-data.appspot.com",
  messagingSenderId: "230988062905",
  appId: "1:230988062905:web:5e269fec840b17f3ed7b68",
  measurementId: "G-6QVYTNY3W2",
};

// Initialize Firebase
const firebaseDb = initializeApp(firebaseConfig);

export default firebaseDb;
