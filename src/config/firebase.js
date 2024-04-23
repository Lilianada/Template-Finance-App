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
  apiKey: "AIzaSyAftuPYYBI-dzVAkHuW0fTFHuFKOuw1GPE",
  authDomain: "cvs-online.firebaseapp.com",
  projectId: "cvs-online",
  storageBucket: "cvs-online.appspot.com",
  messagingSenderId: "670629794189",
  appId: "1:670629794189:web:5750b0322220e92853adc4",
  measurementId: "G-6CCX8SFW6Z"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); 
export const storage = getStorage(app);

