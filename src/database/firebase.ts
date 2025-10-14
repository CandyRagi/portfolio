// Import Firebase core and Firestore
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "",
  authDomain: "portfolio-fbd25.firebaseapp.com",
  projectId: "portfolio-fbd25",
  storageBucket: "portfolio-fbd25.firebasestorage.app",
  messagingSenderId: "966927646623",
  appId: "1:966927646623:web:a3cec536e99e4d8fc307aa"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore database
export const db = getFirestore(app);


