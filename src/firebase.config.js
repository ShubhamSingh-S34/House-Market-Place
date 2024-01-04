// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8bJIi-QdGDf3Dh2uOAaEJAKbDkwmCxDM",
  authDomain: "house-market-place-de9bc.firebaseapp.com",
  projectId: "house-market-place-de9bc",
  storageBucket: "house-market-place-de9bc.appspot.com",
  messagingSenderId: "838996019977",
  appId: "1:838996019977:web:12dd67e58ba5a03b6f21d8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);