// firebaseConfig.js
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBaF-dkaE92f4rmAHior_XwZtYNtWBMZsc",
    authDomain: "events-eat.firebaseapp.com",
    databaseURL: "https://events-eat-default-rtdb.firebaseio.com",
    projectId: "events-eat",
    storageBucket: "events-eat.appspot.com",
    messagingSenderId: "437996638544",
    appId: "1:437996638544:web:3702f60e89b561a40d1c55",
    measurementId: "G-NW9KYWTTBZ"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, provider, firestore, storage };
