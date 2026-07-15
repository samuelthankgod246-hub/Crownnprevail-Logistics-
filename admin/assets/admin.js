// ============================================================
// CrownPrevail Logistics — Admin Dashboard Core JS
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, orderBy, limit, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAXpkiAZpVsmQ4CeyfR_cn8cmOzvklQqXI",
  authDomain: "crownprevail-logistics.firebaseapp.com",
  projectId: "crownprevail-logistics",
  storageBucket: "crownprevail-logistics.firebasestorage.app",
  messagingSenderId: "1026209370719",
  appId: "1:1026209370719:web:f3ce4b1d0d412d21d401ea",
  measurementId: "G-1X28HRDEQX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ── Auth State ──────────────────────────────────
let currentUser = null;

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  const adminContent = document.getElementById('admin-content');
  if (adminContent) {
    if (user) {
      adminContent.style.display = 'block';
      document.getElementById('login-section')?.remove();
    } else {
      adminContent.style.display = 'none';
    }
  }
  const userEmailEl = document.getElementById('user-email');
  if (userEmailEl) userEmailEl.textContent = user ? user.email : '';
});

// ── Auth Functions ──────────────────────────────
export async function loginAdmin(email, password) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: cred.user };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function logoutAdmin() {
  try {
    await signOut(auth);
    window.location.href = 'index.html';
  } catch (err) {
    console.error('Logout error:', err);
  }
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
    return null;
  }
}

export async function addDocument(collectionName, data) {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (err) {
    console.error(`Error adding document:`, err);
    return { success: false, error: err.message };
  }
}

export async function updateDocument(collectionName, docId, data) {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (err) {
    console.error(`Error updating document:`, err);
    return { success: false, error: err.message };
  }
}

export async function deleteDocument(collectionName, docId) {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return { success: true };
  } catch (err) {
    console.error(`Error deleting document:`, err);
    return { success: false, error: err.message };
  }
}

export async function getCount(collectionName) {
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    return snapshot.size;
  } catch (err) {
    return 0;
  }
}

// ── Formatting ──────────────────────────────────
export function formatDate(timestamp) {
  if (!timestamp) return '-';
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
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
