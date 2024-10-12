// Import the necessary functions from the Firebase SDKs
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDrpYgy9FeLM7ZaAR24hQC-1swkUyzpVLk",
    authDomain: "job-board-20564.firebaseapp.com",
    projectId: "job-board-20564",
    storageBucket: "job-board-20564.appspot.com",
    messagingSenderId: "810897728925",
    appId: "1:810897728925:web:b065e853b6fa747eaa7b74"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(firebaseApp);

export { firebaseApp, firestore };
