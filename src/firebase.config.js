// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyy8NkD01EtFlV-qfMNuJrTAw9NIqVkS0",
  authDomain: "home-sweet-home-app.firebaseapp.com",
  projectId: "home-sweet-home-app",
  storageBucket: "home-sweet-home-app.appspot.com",
  messagingSenderId: "126630278208",
  appId: "1:126630278208:web:9f54992d006c5c5d0c1ba5",
  measurementId: "G-TQJSFV1100"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const db = getFirestore();