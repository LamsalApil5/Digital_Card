import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyAdi36CBeH_4Atzfz4wsOl5VQ0UtbBY5nw",
    authDomain: "businesscardprofile.firebaseapp.com",
    databaseURL: "https://businesscardprofile-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "businesscardprofile",
    storageBucket: "businesscardprofile.firebasestorage.app",
    messagingSenderId: "896787454690",
    appId: "1:896787454690:web:6eff0bce8cfd15be3b1cbb",
    measurementId: "G-RPM4XW9G6G"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const database = getDatabase(app);
  
  export { auth, database };