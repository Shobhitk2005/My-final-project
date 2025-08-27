import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9TnRmboaV0XECt0qBzVkufggQVl5fKYc",
  authDomain: "learnly-63700.firebaseapp.com",
  projectId: "learnly-63700",
  storageBucket: "learnly-63700.firebasestorage.app",
  messagingSenderId: "187007459423",
  appId: "1:187007459423:web:f4b713a2471362bb007bea",
  measurementId: "G-JMF3EKB9WW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;