import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { ref, get } from "firebase/database"; // Firebase methods
import { auth, database } from "../firebase"; // Corrected imports
import companyLogo from "../companylogo.png"; // Default logo

function Header({ user }) {
  const [companyLogoUrl, setCompanyLogoUrl] = useState(companyLogo); // Default logo
  const [companyName, setCompanyName] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const storedUserUID = localStorage.getItem("userUID");

  // Fetch user and company data
  const fetchUserData = useCallback(async (userId) => {
    try {
      const userRef = ref(database, `users/${userId}`);
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val();

      if (userData && userData.companyId) {
        const companyRef = ref(database, `companies/${userData.companyId}`);
        const companySnapshot = await get(companyRef);
        const companyData = companySnapshot.val();

        if (companyData) {
          setCompanyLogoUrl(companyData.logo || null);
          setCompanyName(companyData.companyName || "");
        }
      }
    } catch (error) {
      console.error("Error fetching data from Firebase:", error);
    }
  }, []);

  useEffect(() => {
    const userId = storedUserUID || user?.uid;
    if (userId) {
      fetchUserData(userId);
    }
  }, [storedUserUID, user?.uid, fetchUserData]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("userUID");
      localStorage.removeItem("userId");

      navigate("/login"); // Navigate to login page
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <header className="bg-white text-black py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link
          to={`/DigitalCard/${user ? user.uid : "guest"}`}
          className="text-lg font-bold hover:underline"
        >
          <img
            src={companyLogoUrl}
            alt={`Company logo for ${companyName}`}
            className="h-10 sm:h-12 max-h-12"
          />
        </Link>

        {/* Hamburger button for mobile */}
        <button
          onClick={toggleMenu}
          className="block lg:hidden focus:outline-none"
        >
          <span className="text-black text-3xl">&#9776;</span>
        </button>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex space-x-4">
          {user ? (
            <>
              <Link to="/profile" className="hover:underline">
                Profile
              </Link>
              <button onClick={handleLogout} className="hover:underline">
                Logout
              </button>
            </>
          ) : (
            <></>
          )}
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-orange-600 text-white w-full absolute top-16 left-0 py-4 px-6 z-50">
          <nav className="space-y-4">
            {user ? (
              <>
                <Link to="/profile" className="hover:underline block">
                  Profile
                </Link>
                <button onClick={handleLogout} className="hover:underline block">
                  Logout
                </button>
              </>
            ) : (
              <></>
            )}
            {/* Preview Button */}
            <button
              onClick={() => {
                const userId = localStorage.getItem("userUID");
                if (userId) {
                  window.open(`/digitalCard/${userId}`, "_blank");
                } else {
                  console.log("UserId not found in localStorage");
                }
              }}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Preview
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
