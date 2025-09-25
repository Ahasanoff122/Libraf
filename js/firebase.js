import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD6MLOOhj1AbAP4mSW9800bLKr7dKyB5QU",
  authDomain: "libraff-2d9de.firebaseapp.com",
  projectId: "libraff-2d9de",
  storageBucket: "libraff-2d9de.firebasestorage.app",
  messagingSenderId: "935006086000",
  appId: "1:935006086000:web:518181af1ca12d680ea5b5",
  measurementId: "G-1RGYRR5776"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
