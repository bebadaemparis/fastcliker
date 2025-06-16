// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC_5fAFshTtV57CTR_NPSrV6k4yM4hB_-E",
  authDomain: "fastcliker-game.firebaseapp.com",
  projectId: "fastcliker-game",
  storageBucket: "fastcliker-game.firebasestorage.app",
  messagingSenderId: "67952016648",
  appId: "1:67952016648:web:4dfa1e5e421f7581fbc0bd"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
