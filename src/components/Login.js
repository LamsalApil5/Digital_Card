import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // To track loading state
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    setIsLoading(true); // Start loading
    try {
      // Sign in the user with email and password
      await signInWithEmailAndPassword(auth, email, password);
      // Navigate to the profile page upon successful login
      navigate('/profile');
    } catch (error) {
      setError('Invalid credentials'); // Set error message if login fails
    } finally {
      setIsLoading(false); // Stop loading after the login attempt
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          type="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          type="password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={handleLogin}
        className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4 hover:bg-blue-600 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">Don't have an account? 
          <span
            onClick={() => navigate('/signup')}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;