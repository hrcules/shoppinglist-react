import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUUMWwfT3_BsG7FZkKwA1tTrDi-_vpXiM",
  authDomain: "shopping-list-6d985.firebaseapp.com",
  projectId: "shopping-list-6d985",
  storageBucket: "shopping-list-6d985.appspot.com",
  messagingSenderId: "784328880652",
  appId: "1:784328880652:web:3845b6a89f91cb15beb429",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
