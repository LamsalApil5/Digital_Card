import React from "react";
import { Link } from "react-router-dom";

function Header({ user, handleLogout }) {
  // Get the userUID from localStorage if user is not provided
  const storedUserUID = localStorage.getItem("userUID");
  const currentUser = user || storedUserUID ? { uid: storedUserUID, email: user?.email } : null;

  return (
    <header className="bg-blue-500 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link to={`/DigitalCard/${currentUser ? currentUser.uid : 'guest'}`} className="text-lg font-bold hover:underline">
          Digital Card
        </Link>
        <nav className="flex space-x-4">
          {currentUser ? (
            <>
              <Link to={`/DigitalCard/${currentUser.uid}`} className="hover:underline">Card</Link>
              <Link to="/profile" className="hover:underline">Profile</Link>
              <button
                onClick={handleLogout}
                className="hover:underline"
              >
                Logout
              </button>
              <span>{currentUser.email}</span> {/* Displaying user email */}
            </>
          ) : (
            <>
              {/* Add navigation for non-authenticated users (if needed) */}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
