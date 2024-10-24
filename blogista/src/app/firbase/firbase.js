import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyASZ9TqULHPETY-HgkwJJRTwXP49qLuIkc",
  authDomain: "blogista-90cb1.firebaseapp.com",
  projectId: "blogista-90cb1",
  storageBucket: "blogista-90cb1.appspot.com",
  messagingSenderId: "478187114965",
  appId: "1:478187114965:web:4a3b235d62c8c2c83ded5c",
  measurementId: "G-069SNRM6G9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider(); // Google Sign-In provider
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, googleProvider, db, storage };
