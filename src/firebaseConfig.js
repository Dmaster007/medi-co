// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7Uwx0hPLQj55fJAhFgcF2Ehyo5_nXSc8",
  authDomain: "medi-co-f48c3.firebaseapp.com",
  projectId: "medi-co-f48c3",
  storageBucket: "medi-co-f48c3.appspot.com",
  messagingSenderId: "46210208203",
  appId: "1:46210208203:web:8266d56e70e08c96b5e64e",
  measurementId: "G-MS7FYV9Z8T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const storage = getStorage(app)