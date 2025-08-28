// Admin Setup Script
// Run this once to create your admin user
// Usage: node setup-admin.js

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Your Firebase config
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
const auth = getAuth(app);
const db = getFirestore(app);

// Admin user details - CHANGE THESE
const ADMIN_EMAIL = "admin@yourdomain.com";
const ADMIN_PASSWORD = "yourStrongPassword123";
const ADMIN_NAME = "Your Name";

async function createAdminUser() {
  try {
    console.log("Creating admin user...");
    
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      ADMIN_EMAIL, 
      ADMIN_PASSWORD
    );
    
    const user = userCredential.user;
    console.log("✅ User created with UID:", user.uid);
    
    // Update display name
    await updateProfile(user, { displayName: ADMIN_NAME });
    console.log("✅ Display name updated");
    
    // Create user document with admin role
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: ADMIN_NAME,
      role: 'admin', // 👈 This makes them admin
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp()
    });
    
    console.log("✅ Admin user document created in Firestore");
    console.log("🎉 Admin setup complete!");
    console.log("📧 Email:", ADMIN_EMAIL);
    console.log("🔑 Password:", ADMIN_PASSWORD);
    console.log("👤 Role: admin");
    
    process.exit(0);
    
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
    process.exit(1);
  }
}

// Run the setup
createAdminUser();