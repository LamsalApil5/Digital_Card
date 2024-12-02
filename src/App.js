import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Profile from "./components/Profile";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import DigitalCard from "./components/DigitalCard";
import { auth } from "./firebase";

function App() {
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
      <div className="App bg-gray-100 min-h-screen">
        {/* Header Section */}
        <header className="bg-blue-500 text-white py-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center px-6">
            <Link to={`/DigitalCard/${user ? user.uid : 'guest'}`} className="text-lg font-bold hover:underline">
              Digital Card
            </Link>
            <nav className="flex space-x-4">
              {user ? (
                <>
                  <Link to={`/DigitalCard/${user.uid}`} className="hover:underline">Card</Link>
                  <Link to="/profile" className="hover:underline">Profile</Link>
                  <button
                    onClick={handleLogout}
                    className="hover:underline"
                    >
                    Logout
                  </button>
                    <span>{user.email}</span> {/* Displaying user email */}
                </>
              ) : (
                <>
                  {/* Add navigation for non-authenticated users (if needed) */}
                </>
              )}
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <div className="auth-wrapper w-full max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
          <div className="auth-inner">
            <Routes>
              <Route
                path="/"
                element={user ? <Navigate to={`/profile`} /> : <Navigate to="/login" />}
              />
              <Route path="/login" element={user ? <Navigate to={`/profile`} /> : <Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route
                path="/DigitalCard/:userUID"
                element={<DigitalCard />}
              />
              <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
            </Routes>
            <ToastContainer />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
