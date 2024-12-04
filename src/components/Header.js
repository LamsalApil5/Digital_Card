import React, { useState } from "react";
import { Link } from "react-router-dom";

function Header({ user, handleLogout }) {
  // Get the userUID from localStorage if user is not provided
  const storedUserUID = localStorage.getItem("userUID");
  const currentUser = user || storedUserUID ? { uid: storedUserUID, email: user?.email } : null;

  // State for toggling the mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle the menu on small screens
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-orange-600 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link to={`/DigitalCard/${currentUser ? currentUser.uid : 'guest'}`} className="text-lg font-bold hover:underline">
          Digital Card
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
              <Link to="/profile" className="hover:underline">Profile</Link>
              <button onClick={handleLogout} className="hover:underline">Logout</button>
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
                <Link to="/profile" className="hover:underline block">Profile</Link>
                <button onClick={handleLogout} className="hover:underline">Logout</button>
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
