// Firebase Configuration (Environment-aware)
// For production, these should come from backend/environment variables
// This is a placeholder - in production, fetch from secure backend endpoint

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAXpkiAZpVsmQ4CeyfR_cn8cmOzvklQqXI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "crownprevail-logistics.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "crownprevail-logistics",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "crownprevail-logistics.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1026209370719",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1026209370719:web:f3ce4b1d0d412d21d401ea",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-1X28HRDEQX"
};

// Note: In production, implement backend endpoint to fetch config securely
// export async function getSecureFirebaseConfig() {
//   const response = await fetch('/api/config/firebase');
//   if (!response.ok) throw new Error('Failed to fetch Firebase config');
//   return response.json();
// }
