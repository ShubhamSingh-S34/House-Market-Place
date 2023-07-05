// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaTyprSxV9r1cFxE_9HeWl0osM5SWeUBg",
  authDomain: "house-market-place-e94fc.firebaseapp.com",
  projectId: "house-market-place-e94fc",
  storageBucket: "house-market-place-e94fc.appspot.com",
  messagingSenderId: "888890746165",
  appId: "1:888890746165:web:e095eae6eb0232962b987c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);