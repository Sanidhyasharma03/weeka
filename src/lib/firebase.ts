
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA3hBRP45rOLxv7REbeeXx4T1o-4gqc81c",
  authDomain: "phixelforge.firebaseapp.com",
  projectId: "phixelforge",
  storageBucket: "phixelforge.appspot.com",
  messagingSenderId: "1029954431014",
  appId: "1:1029954431014:web:e1b60350a99b07fe121ee7"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
