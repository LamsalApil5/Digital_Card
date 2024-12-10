import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Profile from "./components/Profile";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import DigitalCard from "./components/DigitalCard";
import { auth } from "./firebase";
import Header from "./components/Header";
import ForgotPassword from "./components/ForgotPassword";
import AppLoader from "./components/AppLoader";
import Company from "./components/company";
function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    // On initial load, check if user data exists in localStorage or from auth state
    const storedUserUID = localStorage.getItem("userUID");

    if (storedUserUID) {
      setUser({ uid: storedUserUID });
    }

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        localStorage.setItem("userUID", currentUser.uid);
        setUser({ uid: currentUser.uid, email: currentUser.email });
      } else {
        localStorage.removeItem("userUID");
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="bg-white min-h-screen">
        {user && <Header user={user} />}
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

      </div>
    </Router>
  );
}

export default App;
