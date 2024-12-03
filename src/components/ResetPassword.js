import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, confirmPasswordReset } from 'firebase/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Initialize toast notifications
toast.configure();

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Get the query parameter from the URL (the token passed in the reset link)
  const searchParams = new URLSearchParams(location.search);
  const oobCode = searchParams.get('oobCode');

  useEffect(() => {
    if (!oobCode) {
      toast.error('Invalid or expired reset link.', { position: toast.POSITION.TOP_CENTER });
    }
  }, [oobCode]);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error('Please enter both password fields.', { position: toast.POSITION.TOP_CENTER });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.', { position: toast.POSITION.TOP_CENTER });
      return;
    }

    try {
      // Confirm the password reset using the oobCode and new password
      const auth = getAuth();
      await confirmPasswordReset(auth, oobCode, newPassword);
      toast.success('Password reset successful. Redirecting to login...', { position: toast.POSITION.TOP_CENTER });
      setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3 seconds
    } catch (error) {
      toast.error('Error resetting password. Please try again.', { position: toast.POSITION.TOP_CENTER });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Reset Password</h2>
        
        <div className="mb-4">
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            id="newPassword"
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
          />
        </div>

        <button
          onClick={handleResetPassword}
          className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4 hover:bg-blue-600"
        >
          Reset Password
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

export default ResetPassword;
