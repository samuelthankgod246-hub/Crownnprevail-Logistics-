import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAXpkiAZpVsmQ4CeyfR_cn8cmOzvklQqXI",
  authDomain: "crownprevail-logistics.firebaseapp.com",
  projectId: "crownprevail-logistics",
  storageBucket: "crownprevail-logistics.firebasestorage.app",
  messagingSenderId: "1026209370719",
  appId: "1:1026209370719:web:f3ce4b1d0d412d21d401ea",
  measurementId: "G-1X28HRDEQX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
