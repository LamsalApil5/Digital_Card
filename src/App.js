import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate,useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Profile from "./components/Profile";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import DigitalCard from "./components/DigitalCard";
import { auth } from "./firebase";
import Header from "./components/Header"; // Import the Header component
import ForgotPassword from './components/ForgotPassword';
function App() {
  const { userUID } = useParams(); 
  const [user, setUser] = useState(null); // `null` for initial loading state
  const [loading, setLoading] = useState(true); // To track auth state loading

  useEffect(() => {
    // Try to get the user UID from localStorage
    const storedUserUID = localStorage.getItem("userUID");

    if (storedUserUID) {
      setUser({ uid: storedUserUID });
    }

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        // Store only the UID in localStorage when user logs in
        localStorage.setItem("userUID", currentUser.uid);
        setUser({ uid: currentUser.uid, email: currentUser.email }); // Set the user state with UID and email
      } else {
        // Remove the UID from localStorage when user logs out
        localStorage.removeItem("userUID");
        setUser(null); // Set user state to null
      }

      setLoading(false); // Stop showing loading when state is set
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
    localStorage.removeItem("userUID"); // Ensure we remove the UID from localStorage on logout
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="bg-white min-h-screen">
        {/* Conditionally render Header only if the user is logged in */}
        {user && <Header user={user} handleLogout={handleLogout} />}

        {/* Main Content */}
        <div className="">
          <div className="auth-inner">
            <Routes>
              <Route
                path="/"
                element={user ? <Navigate to={`/profile`} /> : <Navigate to="/login" />}
              />
              <Route path="/login" element={user ? <Navigate to={`/profile`} /> : <Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            
              <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />

  <Route path="/digitalCard/:userUID" element={<DigitalCard />} />
            </Routes>
            <ToastContainer
              position="bottom-right" 
              autoClose={3000} 
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
