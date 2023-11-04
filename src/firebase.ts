// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvaV7tTMP0te_6miCfbuEHoH6oO8E3XvI",
  authDomain: "nwitter-reloaded-476fd.firebaseapp.com",
  projectId: "nwitter-reloaded-476fd",
  storageBucket: "nwitter-reloaded-476fd.appspot.com",
  messagingSenderId: "1034911799698",
  appId: "1:1034911799698:web:c0915d382b75374664894b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);