import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDzjNdpvL1YknoWXIcFnZead4vzKxJSEbo",
  authDomain: "twitter-clone-4d3a3.firebaseapp.com",
  projectId: "twitter-clone-4d3a3",
  storageBucket: "twitter-clone-4d3a3.appspot.com",
  messagingSenderId: "675672398991",
  appId: "1:675672398991:web:00d6901ba734351beb24fa",
  measurementId: "G-RWSSX1K8H2",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

export default app;
export { db, storage };
