import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { Database, getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCWi7-q1zWWE3cYqZ3qUeqA5ZPj3plUMTI",
  authDomain: "fittrack-af060.firebaseapp.com",
  projectId: "fittrack-af060",
  storageBucket: "fittrack-af060.appspot.com",
  messagingSenderId: "356988615349",
  appId: "1:356988615349:web:caafff61cfbc9ebd14dcfc",
  measurementId: "G-L0F33J1GSN",
  databaseURL: "https://fittrack-af060-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);


export default app;
