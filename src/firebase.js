import { initializeApp } from 'firebase/app';
     import { getAuth } from 'firebase/auth';
     import { getFirestore } from 'firebase/firestore';

     const firebaseConfig = {
        apiKey: "AIzaSyCOkY61DKNumtoTuGrbC1jYVyL_76AQ0hY",
        authDomain: "online-gaming-platform-d67a0.firebaseapp.com",
        projectId: "online-gaming-platform-d67a0",
        storageBucket: "online-gaming-platform-d67a0.firebasestorage.app",
        messagingSenderId: "32663160943",
        appId: "1:32663160943:web:d9b9fb5c2374aa9bef659a",
        measurementId: "G-WJGX2E2VRC"
     };

     // Initialize Firebase
     const app = initializeApp(firebaseConfig);
     const auth = getAuth(app);
     const db = getFirestore(app);

     export { auth, db };