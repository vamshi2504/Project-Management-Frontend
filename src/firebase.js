import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCDBxyS4vBA3DAaVA-SfmMrSLoPNKCl6dM",
  authDomain: "project-management-syste-d26b5.firebaseapp.com",
  projectId: "project-management-syste-d26b5",
  storageBucket: "project-management-syste-d26b5.firebasestorage.app",
  messagingSenderId: "300185224531",
  appId: "1:300185224531:web:cc78d495c886b91da60da6",
  measurementId: "G-TZ8B4ZX1Y5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
const githubProvider = new GithubAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, googleProvider, githubProvider, db, storage };
