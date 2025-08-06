import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

// TODO: Add your own Firebase configuration from your project settings
const firebaseConfig = {
  apiKey: "AIzaSyDoF9WZSVe4GlwYCvDlxtWUqq9pHz7GLdA",
  authDomain: "fairride-koronadal.firebaseapp.com",
  projectId: "fairride-koronadal",
  storageBucket: "fairride-koronadal.firebasestorage.app",
  messagingSenderId: "16577067553",
  appId: "1:16577067553:web:88475222a53bf470904160"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);