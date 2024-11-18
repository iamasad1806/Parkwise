// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6NyOjaTi1E8yBal8UBvOQghURsZBP4Vk",
  authDomain: "parkwise-18.firebaseapp.com",
  databaseURL: "https://parkwise-18-default-rtdb.firebaseio.com/",
  projectId: "parkwise-18",
  storageBucket: "parkwise-18.appspot.com",
  messagingSenderId: "216696593003",
  appId: "1:216696593003:web:1aff3fc69b452392286f2e",
  measurementId: "G-4ZKMX35DJX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the database for use in other files
export const auth = getAuth(app);
export const database = getDatabase(app);


export default app;