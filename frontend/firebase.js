// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "oscar-a6a04.firebaseapp.com",
  projectId: "oscar-a6a04",
  storageBucket: "oscar-a6a04.firebasestorage.app",
  messagingSenderId: "461517596491",
  appId: "1:461517596491:web:ca1221899527196437eace"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);