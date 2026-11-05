import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCqiQ5jGuDUTJUPD-sKw9AxQQt8AAMtLeY",
  authDomain: "najjehne-a06e8.firebaseapp.com",
  projectId: "najjehne-a06e8",
  storageBucket: "najjehne-a06e8.firebasestorage.app",
  messagingSenderId: "357501172386",
  appId: "1:357501172386:web:4f762169e88a50519375fb",
  measurementId: "G-647EXD4JP8"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app)