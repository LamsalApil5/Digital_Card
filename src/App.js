import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Profile from "./components/Profile";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import DigitalCard from "./components/DigitalCard";
import { auth } from "./firebase";
import Header from "./components/Header";
import ForgotPassword from "./components/ForgotPassword";
import Footer from "./components/Footer";
import AppLoader from "./components/AppLoader";
import Company from "./components/company";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for Firebase Auth state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser({ uid: currentUser.uid, email: currentUser.email });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
  };

  return (
    <Router>
      <div className="bg-white min-h-screen">
        {user && <Header user={user} handleLogout={handleLogout} />}
        <div>
          <AppLoader />
        </div>

        <div className="">
          <div className="auth-inner">
            <Routes>
              {/* Main Redirect Logic */}
              <Route
                path="/"
                element={user ? <Navigate to="/profile" /> : <Navigate to="/login" />}
              />
              <Route
                path="/login"
                element={user ? <Navigate to="/profile" /> : <Login />}
              />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/company" element={<Company />} />
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

        {user && <Footer />}
      </div>
    </Router>
  );
}

export default App;
