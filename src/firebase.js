import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence  } from "firebase/auth";

// Replace with YOUR Firebase config (from Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyDDb7HT5ZrrKciOdtTHUfWGFpMeksaJAiA",
  authDomain: "peer-project-hub-206b0.firebaseapp.com",
  projectId: "peer-project-hub-206b0",
  storageBucket: "peer-project-hub-206b0.firebasestorage.app",
  messagingSenderId: "908677570898",
  appId: "1:908677570898:web:02d533d63264af3a7f1a8b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Set persistence
setPersistence(auth, browserLocalPersistence).catch(err => {
  console.error("Persistence error:", err);
});