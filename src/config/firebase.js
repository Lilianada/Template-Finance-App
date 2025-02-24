// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDb4M3RkF05s2dDZ8tb5n1VqA7jZwMsMuk",
  authDomain: "maryana-893ef.firebaseapp.com",
  projectId: "maryana-893ef",
  storageBucket: "maryana-893ef.appspot.com",
  messagingSenderId: "808905345639",
  appId: "1:808905345639:web:e9d0f3cd5e4ff728dda2c2",
  measurementId: "G-KKDGKEY0GS"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); 
export const storage = getStorage(app);

