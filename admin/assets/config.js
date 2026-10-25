// Firebase Configuration (static-safe)
// Works both as plain ES modules on static hosting AND under a bundler (Vite).
// Note: Firebase web config values are public-by-design; real protection
// lives in Firestore security rules (see /firestore.rules), not here.

// Safe access to Vite's import.meta.env — undefined when served statically.
const viteEnv = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};

const firebaseConfig = {
  apiKey: viteEnv.VITE_FIREBASE_API_KEY || "AIzaSyAXpkiAZpVsmQ4CeyfR_cn8cmOzvklQqXI",
  authDomain: viteEnv.VITE_FIREBASE_AUTH_DOMAIN || "crownprevail-logistics.firebaseapp.com",
  projectId: viteEnv.VITE_FIREBASE_PROJECT_ID || "crownprevail-logistics",
  storageBucket: viteEnv.VITE_FIREBASE_STORAGE_BUCKET || "crownprevail-logistics.firebasestorage.app",
  messagingSenderId: viteEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "1026209370719",
  appId: viteEnv.VITE_FIREBASE_APP_ID || "1:1026209370719:web:f3ce4b1d0d412d21d401ea",
  measurementId: viteEnv.VITE_FIREBASE_MEASUREMENT_ID || "G-1X28HRDEQX"
};

// Validate required config
const requiredKeys = ['apiKey', 'authDomain', 'projectId'];
const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);

if (missingKeys.length > 0) {
  console.error('Firebase configuration is incomplete. Missing keys:');
  missingKeys.forEach(key => console.error(`  - ${key}`));
}

// OpenRouter API Configuration (never hardcoded into static files;
// preferred path is the aiProxy Cloud Function — see functions/index.js)
const openRouterConfig = {
  apiKey: viteEnv.VITE_OPENROUTER_API_KEY || null
};

// Gemini API Configuration
const geminiConfig = {
  apiKey: viteEnv.VITE_GEMINI_API_KEY || null,
  model: 'gemini-3.8-flash'
};

// AI proxy endpoint (Cloud Function). Leave null until functions are deployed;
// the client then falls back to direct calls with locally stored keys.
const aiProxyConfig = {
  url: viteEnv.VITE_AI_PROXY_URL || null
};

// Export configs
export { firebaseConfig, openRouterConfig, geminiConfig, aiProxyConfig };
