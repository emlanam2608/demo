// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCG8Q2bmUCM1kgigkqjp5r9bFavjD5ledg",
  authDomain: "introduce-traditonal-village.firebaseapp.com",
  projectId: "introduce-traditonal-village",
  storageBucket: "introduce-traditonal-village.appspot.com",
  messagingSenderId: "342482927730",
  appId: "1:342482927730:web:516bce2e92f566922002eb",
  measurementId: "G-N4N9W577WP"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
