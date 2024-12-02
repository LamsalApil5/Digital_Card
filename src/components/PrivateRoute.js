// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { auth } from '../firebase'; // Make sure this is the correct path to your firebase.js file

const PrivateRoute = ({ element, ...rest }) => {
  const user = getAuth(auth).currentUser;

  return user ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
