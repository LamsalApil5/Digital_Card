import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDFbCCQCFp7seRYlbD5JY8at5Eopn70zjQ",
  authDomain: "digital-card-aa016.firebaseapp.com",
  databaseURL: "https://digital-card-aa016-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "digital-card-aa016",
  storageBucket: "digital-card-aa016.firebasestorage.app",
  messagingSenderId: "333033985151",
  appId: "1:333033985151:web:6b38d4d74a8b9cfb741b4a",
  measurementId: "G-GXQDW2H9VC"
  };
  

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const database = getDatabase(app);
  
  export { auth, database };