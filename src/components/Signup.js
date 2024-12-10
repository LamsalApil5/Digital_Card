import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { database } from "../firebase";
import { get, ref } from "firebase/database";
const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    const userRef = ref(database, `users`); // Reference to users in the database
  
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }
  
    try {
      // Check if the email already exists
      const snapshot = await get(userRef);
      const users = snapshot.val(); // Get all users from the database
  
      // Check if users data exists
      if (users) {
        // Loop through users to check if any email matches
        const emailExists = Object.keys(users).some(
          (key) => users[key].email === email
        );
  
        if (emailExists) {
          toast.error("This email is already registered.");
          return;
        }
      }
  
      // If email doesn't exist, proceed with signup and navigation
      navigate(`/company`, {
        state: { email, password },
      });
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Error: ", error);
    }
  };
  

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-sm w-full p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Signup</h2>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          onClick={handleSignup}
          className="w-full py-2 mt-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
        >
          Signup
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?
            <span
              onClick={() => navigate("/login")}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
