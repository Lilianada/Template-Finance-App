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
  apiKey: "AIzaSyDSU7CDV1p59pbMqZPng5cV8Zf_Euu3DqE",
  authDomain: "fir-app-6e8f9.firebaseapp.com",
  databaseURL: "https://fir-app-6e8f9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fir-app-6e8f9",
  storageBucket: "fir-app-6e8f9.appspot.com",
  messagingSenderId: "179954532869",
  appId: "1:179954532869:web:2b34f910894f06cae7926c",
  measurementId: "G-81NLXB20H7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); 
export const storage = getStorage(app);

