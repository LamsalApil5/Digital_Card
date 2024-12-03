import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, database } from '../firebase'; // Firebase initialization
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }

    // Check if email exists in the Realtime Database
    const userRef = ref(database, 'users');
    try {
      // Fetch all users and check if the email exists
      const snapshot = await get(userRef);
      const users = snapshot.val();

      // Check if any user has the given email
      let emailExists = false;
      for (let uid in users) {
        if (users[uid].contactemi === email) {
          emailExists = true;
          break;
        }
      }

      if (!emailExists) {
        toast.error('This email address is not registered.');
        setSuccessMessage('');
        return;
      }

      // If email exists, send password reset email
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent. Please check your inbox.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      toast.error('Failed to send reset email. Please check the email address and try again.');
      console.error('Error:', error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-sm w-full p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Forgot Password</h2>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            id="email"
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>


        <button
          onClick={handleForgotPassword}
          className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4 hover:bg-blue-600"
        >
          Send Reset Email
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Remembered your password? 
            <span
              onClick={() => navigate('/login')}
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

export default ForgotPassword;
