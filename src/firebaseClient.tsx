import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, inMemoryPersistence } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyDyAFDVg2VlE9F3JmETFLWml5k6XMJKCs4",
  authDomain: "weatherapp-43a4d.firebaseapp.com",
  projectId: "weatherapp-43a4d",
  storageBucket: "weatherapp-43a4d.firebasestorage.app",
  messagingSenderId: "370184407843",
  appId: "1:370184407843:web:4e1dd98e5acf8398679a96",
  measurementId: "G-L2JX78X4FV"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
setPersistence(auth, inMemoryPersistence);

export { app, auth, provider };




