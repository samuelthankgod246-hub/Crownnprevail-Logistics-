// Firebase Configuration (Environment-aware)
// Environment variables are injected at build time
// For local development, use .env file (see .env.example)

// Check if we're in a build environment with Vite
// Vite exposes env variables prefixed with VITE_ (not VITE_)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate required config
const requiredKeys = ['apiKey', 'authDomain', 'projectId'];
const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);

if (missingKeys.length > 0) {
  console.error('Firebase configuration is incomplete. Please create a .env file with the following keys:');
  missingKeys.forEach(key => console.error(`  - VITE_${key.toUpperCase()}`));
  console.error('See .env.example for a template.');
}

// OpenRouter API Configuration
const openRouterConfig = {
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || null
};

// Gemini API Configuration
const geminiConfig = {
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || null,
  model: 'gemini-1.5-flash'
};

// Export configs
export { firebaseConfig, openRouterConfig, geminiConfig };
