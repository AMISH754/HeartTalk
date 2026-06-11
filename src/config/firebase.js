import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {
  console.log("Signup called", username, email);

  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    console.log("user", res);
    const user = res.user;
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avatar: "",
      bio: "Hey I am using chat app",
      lastSeen: Date.now(),
    })
    await setDoc(doc(db, "chats", user.uid), {
      chatData: []
    })

  }
  catch (error) {
    console.error(error);

    toast.error(error.code);

  }

}

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  }
  catch (error) {
    console.error(error);
    toast.error(error.code);
  }
}

const logout = async () => {
  try {
    await signOut(auth);
  }
  catch (error) {
    console.error(error);
    toast.error(error.code);
  }
}

export { auth, db, signup, login, logout }