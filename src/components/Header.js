// src/components/Header.js
import React from "react";
import { Link } from "react-router-dom";

function Header({ user, handleLogout }) {
  return (
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
  );
}

export default Header;
