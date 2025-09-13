
import { initializeApp, getApp, getApps } from 'firebase/app';

const firebaseConfig = {
  "projectId": "innovative-enterprises",
  "appId": "1:263836954275:web:f2376301e2b0f38f675916",
  "storageBucket": "innovative-enterprises.firebasestorage.app",
  "apiKey": "AIzaSyCFA_JzFen8gSBm0qEAIzb-DTykmOTXViA",
  "authDomain": "innovative-enterprises.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "263836954275"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
