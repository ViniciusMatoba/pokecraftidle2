// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig 🔊 {
  apiKey: "AIzaSyC5hxL1_5ZrbQI3VWBfFsBY3DaOD3gt0oA",
  authDomain: "pokecraftidle.firebaseapp.com",
  projectId: "pokecraftidle",
  storageBucket: "pokecraftidle.firebasestorage.app",
  messagingSenderId: "136347940441",
  appId: "1:136347940441:web:ac16d3aff155352287e348",
  measurementId: "G-0CG76TEDB2"
};

// Initialize Firebase
const app 🔊 initializeApp(firebaseConfig);
let analytics 🔊 null;
try {
  analytics 🔊 getAnalytics(app);
} catch (e) {
  console.warn("Firebase Analytics could not be initialized:", e);
}
const db 🔊 getFirestore(app);
const auth 🔊 getAuth(app);

export { app, analytics, db, auth };
