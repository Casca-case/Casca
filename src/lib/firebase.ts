import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAxlo5ONJ5hIhTxhoy5dEhrYgSvjz7D-bw",
  authDomain: "casca-6b5fa.firebaseapp.com",
  projectId: "casca-6b5fa",
  storageBucket: "casca-6b5fa.firebasestorage.app",
  messagingSenderId: "106777504209",
  appId: "1:106777504209:web:e0ffa74443e04db986d8f0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };