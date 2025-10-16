// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxlo5ONJ5hIhTxhoy5dEhrYgSvjz7D-bw",
  authDomain: "casca-6b5fa.firebaseapp.com",
  projectId: "casca-6b5fa",
  storageBucket: "casca-6b5fa.firebasestorage.app",
  messagingSenderId: "106777504209",
  appId: "1:106777504209:web:e0ffa74443e04db986d8f0",
  measurementId: "G-76FWDKLTSG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

export { app, storage };
