import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDaL18Mt7-oWbWwXuy1j1ov6QepclsUkbU",
  authDomain: "learnly-2c0fc.firebaseapp.com",
  projectId: "learnly-2c0fc",
  storageBucket: "learnly-2c0fc.firebasestorage.app",
  messagingSenderId: "864247257392",
  appId: "1:864247257392:web:faad461dd382d4ace3d0f5",
  measurementId: "G-NQVCSEPJDH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;