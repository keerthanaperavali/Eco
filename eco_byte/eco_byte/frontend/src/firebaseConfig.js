// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBJPXvoImXtJ7JhO19FFR2HKp90cFPtAUw",
  authDomain: "ecobyte-2b6a4.firebaseapp.com",
  projectId: "ecobyte-2b6a4",
  storageBucket: "ecobyte-2b6a4.firebasestorage.app",
  messagingSenderId: "960197350732",
  appId: "1:960197350732:web:4e58a6f027a56162166be9"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };
