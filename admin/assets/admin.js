// ============================================================
// CrownPrevail Logistics — Admin Dashboard Core JS
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, orderBy, limit, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { firebaseConfig } from './config.js';
import { toastManager, sanitizeInput } from './utils.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Enable persistence
setPersistence(auth, browserLocalPersistence).catch(err => console.warn('Persistence error:', err));

// ── Auth State ──────────────────────────────────
let currentUser = null;

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  const adminContent = document.getElementById('admin-content');
  const userEmailEl = document.getElementById('user-email');

  if (adminContent) {
    adminContent.style.display = user ? 'block' : 'none';
  }

  if (userEmailEl) {
    userEmailEl.textContent = user ? user.email : '';
  }
});

// ── Auth Functions ──────────────────────────────
export async function loginAdmin(email, password) {
  try {
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }
    const cred = await signInWithEmailAndPassword(auth, email, password);
    toastManager.success(`Welcome back, ${cred.user.email}!`);
    return { success: true, user: cred.user };
  } catch (err) {
    const errorMessage = parseFirebaseError(err.code);
    toastManager.error(errorMessage);
    return { success: false, error: errorMessage };
  }
}

export async function logoutAdmin() {
  try {
    await signOut(auth);
    toastManager.success('Signed out successfully');
    window.location.href = 'index.html';
  } catch (err) {
    toastManager.error('Error signing out');
    console.error('Logout error:', err);
  }
}

// ── Firebase Error Handler ──────────────────────
function parseFirebaseError(code) {
  const errors = {
    'auth/user-not-found': 'User account not found',
    'auth/wrong-password': 'Incorrect password',
    'auth/invalid-email': 'Invalid email address',
    'auth/user-disabled': 'User account has been disabled',
    'auth/too-many-requests': 'Too many login attempts. Try again later',
    'auth/operation-not-allowed': 'Login is currently unavailable',
    'auth/network-request-failed': 'Network error. Check your connection',
  };
  return errors[code] || 'An error occurred. Please try again.';
}

// ── Firestore Helpers ───────────────────────────
export async function getCollection(collectionName, orderByField = null, orderDir = 'desc') {
  try {
    let q;
    if (orderByField) {
      q = query(collection(db, collectionName), orderBy(orderByField, orderDir));
    } else {
      q = collection(db, collectionName);
    }
    const snapshot = await getDocs(q);
    const items = [];
    snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
    return items;
  } catch (err) {
    console.error(`Error fetching ${collectionName}:`, err);
    toastManager.error(`Failed to load ${collectionName}`);
    return [];
  }
}

export async function getDocument(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
    return null;
  } catch (err) {
    console.error(`Error fetching document:`, err);
    toastManager.error('Failed to load document');
    return null;
  }
}

export async function addDocument(collectionName, data) {
  try {
    // Sanitize string inputs
    const sanitizedData = Object.keys(data).reduce((acc, key) => {
      acc[key] = typeof data[key] === 'string' ? sanitizeInput(data[key]) : data[key];
      return acc;
    }, {});

    const docRef = await addDoc(collection(db, collectionName), {
      ...sanitizedData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    toastManager.success('Item created successfully');
    return { success: true, id: docRef.id };
  } catch (err) {
    console.error(`Error adding document:`, err);
    toastManager.error('Failed to create item');
    return { success: false, error: err.message };
  }
}

export async function updateDocument(collectionName, docId, data) {
  try {
    // Sanitize string inputs
    const sanitizedData = Object.keys(data).reduce((acc, key) => {
      acc[key] = typeof data[key] === 'string' ? sanitizeInput(data[key]) : data[key];
      return acc;
    }, {});

    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, { ...sanitizedData, updatedAt: serverTimestamp() });
    toastManager.success('Item updated successfully');
    return { success: true };
  } catch (err) {
    console.error(`Error updating document:`, err);
    toastManager.error('Failed to update item');
    return { success: false, error: err.message };
  }
}

export async function deleteDocument(collectionName, docId) {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    toastManager.success('Item deleted successfully');
    return { success: true };
  } catch (err) {
    console.error(`Error deleting document:`, err);
    toastManager.error('Failed to delete item');
    return { success: false, error: err.message };
  }
}

export async function getCount(collectionName) {
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    return snapshot.size;
  } catch (err) {
    console.error(`Error getting count:`, err);
    return 0;
  }
}

export async function searchCollection(collectionName, searchField, searchValue) {
  try {
    const q = query(
      collection(db, collectionName),
      where(searchField, '>=', searchValue),
      where(searchField, '<=', searchValue + '\uf8ff')
    );
    const snapshot = await getDocs(q);
    const items = [];
    snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
    return items;
  } catch (err) {
    console.error(`Error searching ${collectionName}:`, err);
    return [];
  }
}

// ── Formatting ──────────────────────────────────
export function formatDate(timestamp) {
  if (!timestamp) return '-';
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
}

export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text, len = 100) {
  if (!text) return '';
  return text.length > len ? text.substring(0, len) + '...' : text;
}

// ── Route Guard ─────────────────────────────────
export function requireAuth() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = 'index.html';
    }
  });
}
