import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  enableIndexedDbPersistence,
  getFirestore,
} from "firebase/firestore";

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

// Persist Firestore documents and queue writes in IndexedDB while offline.
// This must be configured before the app performs its first Firestore read/write.
enableIndexedDbPersistence(db).catch((error: { code?: string }) => {
  if (error.code === "failed-precondition") {
    console.warn(
      "O cache offline do Firestore não foi ativado: outra aba pode estar usando o cache."
    );
    return;
  }

  if (error.code === "unimplemented") {
    console.warn(
      "Este navegador não oferece suporte à persistência offline do Firestore."
    );
    return;
  }

  console.error("Não foi possível ativar o cache offline do Firestore:", error);
});

export { app, auth, db };
