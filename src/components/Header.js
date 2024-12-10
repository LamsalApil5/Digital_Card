import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ref, get } from "firebase/database"; // Import Firebase methods
import companyLogo from "../companylogo.png"; // Default logo
import { database } from "../firebase";

function Header({ user, handleLogout }) {
  const [companyLogoUrl, setCompanyLogoUrl] = useState(companyLogo); // Default logo
  const [companyName, setCompanyName] = useState("");
  const [currentUser, setCurrentUser] = useState(user || null);

  // Get the userUID from localStorage if user is not provided
  const storedUserUID = localStorage.getItem("userUID");

  useEffect(() => {
    const userId = storedUserUID || currentUser?.uid; 
    if (userId) {
      const fetchUserData = async () => {
        try {
          debugger
          // Fetch user data from Firebase Realtime Database
          const userRef = ref(database, "users/" + userId); // Corrected Firebase path
          const userSnapshot = await get(userRef);
          const userData = userSnapshot.val();

          if (userData && userData.companyId) {
            const companyRef = ref(database, "companies/" + userData.companyId); // Corrected Firebase path
            const companySnapshot = await get(companyRef);
            const companyData = companySnapshot.val();
            
            // Set company logo and name
            if (companyData) {
              setCompanyLogoUrl(companyData.logo || companyLogo); // Default logo if none found
              setCompanyName(companyData.companyName || "Multi Dynamic"); // Default name if none found
            }
          }
        } catch (error) {
          console.error("Error fetching data from Firebase:", error);
        }
      };

      fetchUserData();
    }
  }, [storedUserUID, currentUser?.uid]); // Adding currentUser to dependency array for re-fetching when it changes

  // State for toggling the mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle the menu on small screens
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-orange-600 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link
          to={`/DigitalCard/${currentUser ? currentUser.uid : "guest"}`}
          className="text-lg font-bold hover:underline"
        >
          <img
            src={companyLogoUrl} // Set company logo from Firebase
            alt={`Company logo for ${companyName || "Multi Dynamic"}`} // Use company name as fallback
            className="h-10 sm:h-12 max-h-12"
          />
        </Link>

        {/* Hamburger button for mobile */}
        <button
          onClick={toggleMenu}
          className="block lg:hidden focus:outline-none"
        >
          <span className="text-white text-3xl">&#9776;</span> {/* Hamburger icon */}
        </button>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex space-x-4">
          {currentUser ? (
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
            {currentUser ? (
              <>
                <Link to="/profile" className="hover:underline block">
                  Profile
                </Link>
                <button onClick={handleLogout} className="hover:underline">
                  Logout
                </button>
              </>
            ) : (
              <></>
            )}

            {/* Preview Button in Mobile Menu */}
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
