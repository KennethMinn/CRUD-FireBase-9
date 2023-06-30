// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAh14I6UAVGDYC10lMl4d2MqiSM34he1i4",
  authDomain: "fir-9-5cbcc.firebaseapp.com",
  projectId: "fir-9-5cbcc",
  storageBucket: "fir-9-5cbcc.appspot.com",
  messagingSenderId: "364261457395",
  appId: "1:364261457395:web:67431caa838b001e98e686",
};

// Initialize Firebase
initializeApp(firebaseConfig);

const db = getFirestore();

const colRef = collection(db, "books");

const getDoc = async () => {
  const snapShot = await getDocs(colRef);
  console.log(snapShot);
};

getDoc();
console.log("hello");
