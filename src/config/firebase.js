import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCe7BmKqmB7mRHoDuTJLM0_LC5Aaf1CRxk",
  authDomain: "chat-app-59c85.firebaseapp.com",
  projectId: "chat-app-59c85",
  storageBucket: "chat-app-59c85.firebasestorage.app",
  messagingSenderId: "692897103303",
  appId: "1:692897103303:web:cd642c83031204c75e2de2"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {
  // Signup logic will go here
}

export { auth, db, signup };