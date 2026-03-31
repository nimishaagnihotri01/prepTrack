import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const fallbackFirebaseConfig = {
  apiKey: "AIzaSyDYX2ZNVbR007DBPulS7ibDpB2IvvO8PdQ",
  authDomain: "preptrack-f09af.firebaseapp.com",
  projectId: "preptrack-f09af",
  storageBucket: "preptrack-f09af.firebasestorage.app",
  messagingSenderId: "111800066862",
  appId: "1:111800066862:web:3793b66b8d8f7340ce90bf",
  measurementId: "G-K600VQ8B1H",
};

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    fallbackFirebaseConfig.apiKey,
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    fallbackFirebaseConfig.authDomain,
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID ||
    fallbackFirebaseConfig.projectId,
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    fallbackFirebaseConfig.storageBucket,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    fallbackFirebaseConfig.messagingSenderId,
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    fallbackFirebaseConfig.appId,
  measurementId:
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ||
    fallbackFirebaseConfig.measurementId,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
