// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBv18SraaGvhDvcJg6IHOggiaOJk2BVrTM",
  authDomain: "playwrite-5a2c6.firebaseapp.com",
  projectId: "playwrite-5a2c6",
  storageBucket: "playwrite-5a2c6.appspot.com",
  messagingSenderId: "419096866480",
  appId: "1:419096866480:web:7917b598aa1bb337149575",
  measurementId: "G-YQ5002N2VW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);