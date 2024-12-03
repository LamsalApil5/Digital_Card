import React from "react";
import { Link } from "react-router-dom";

function Header({ user, handleLogout }) {
  // Get the userUID from localStorage if user is not provided
  const storedUserUID = localStorage.getItem("userUID");
  const currentUser = user || storedUserUID ? { uid: storedUserUID, email: user?.email } : null;

  return (
    <header className="bg-orange-600 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link to={`/DigitalCard/${currentUser ? currentUser.uid : 'guest'}`} className="text-lg font-bold hover:underline">
          Digital Card
        </Link>
        <nav className="flex space-x-4">
          {currentUser ? (
            <>
              <Link to="/profile" className="hover:underline">Profile</Link>
              <button
                onClick={handleLogout}
                className="hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
