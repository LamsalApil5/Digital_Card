import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { set, ref } from 'firebase/database';
import { auth, database } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      // Create the user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user data in Realtime Database
      const userRef = ref(database, 'users/' + user.uid);
      await set(userRef, {
        email: user.email,
        uid: user.uid,
        createdAt: new Date().toISOString(), // Timestamp when the user was created
        profileSetupComplete: false, // Flag to track if the profile setup is complete
        profile: {
          firstName:'',
          middleName:'',
          lastName:'',
          jobTitle: '',
          companyName:'',
          contactEmail: '',
          contactPhone: '',
          contactTelphone: '',
          profilePicture: '',
          GoogleMap:'',
          dateOfBirth: '',
          address:'',
          socialLinks: { 
            linkedin: '',
            twitter: '',
            instagram: '',
            facebook: '',
            github: '',
            youtube: '',
            website: '',
            reaProfile: '',
          },
        },
      });

      // Navigate to the profile setup page after signup
      navigate('/profile');
    } catch (error) {
      // Show error message in a popup
      toast.error('Enter email and password.');
      console.log('Error creating user: ' + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
  <div className="max-w-md w-full p-6 bg-white shadow-md rounded-lg">
    <h2 className="text-2xl font-bold mb-4">Signup</h2>

    <div className="mb-4">
      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required
      />
    </div>

    <div className="mb-4">
      <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md" 
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
      <p className="text-sm text-gray-600">Already have an account? 
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

export default Signup;
