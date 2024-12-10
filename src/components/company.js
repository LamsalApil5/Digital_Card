import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ref, set, push } from "firebase/database";
import { auth, database } from "../firebase";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";

const Company = () => {
  const location = useLocation(); // Retrieves the state passed via navigate
  const { email, password } = location.state || {}; // Extract email and password from state

  const [companyName, setCompanyName] = useState("");
  const [logo, setLogo] = useState(null);
  const [logoBase64, setLogoBase64] = useState("");
  const navigate = useNavigate();

  // Convert logo image to base64
  const convertToBase64 = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle file input change for logo
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      convertToBase64(file);
    }
  };

  const handleCompanyCreation = async () => {
    if (!companyName || !logoBase64) {
      toast.error("Please provide both a company name and logo.");
      return;
    }
  
    try {
      // Create a new user in Firebase Auth with the email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Create a company entry in Firebase Realtime Database
      const companyRef = push(ref(database, "companies"));
      const companyId = companyRef.key;
  
      // Store company data in Firebase Database
      await set(companyRef, {
        Id: companyId,
        companyName,
        logo: logoBase64,
        createdBy: email, // Associate the company with the creator's email
      });
  
      // Save user data in Firebase Database
      const userRef = ref(database, "users/" + user.uid);
      await set(userRef, {
        email: user.email,
        uid: user.uid,
        companyId,
        createdAt: new Date().toISOString(),
      });
  
      toast.success("Company and user created successfully!");
      // Navigate to profile page after success
      navigate("/profile");  // Assuming '/profile' is the correct route
    } catch (error) {
      console.error("Error creating company:", error);
      toast.error("Error creating company. Please try again.");
    }
  };
  

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-md w-full p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Create Company</h2>

        <div className="mb-4">
          <label
            htmlFor="companyName"
            className="block text-sm font-medium text-gray-700"
          >
            Company Name
          </label>
          <input
            id="companyName"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="logo"
            className="block text-sm font-medium text-gray-700"
          >
            Company Logo
          </label>
          <input
            id="logo"
            type="file"
            onChange={handleLogoChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            accept="image/*"
          />
          {logo && (
            <div className="mt-2">
              <img src={logoBase64} alt="Logo Preview" className="w-20 h-20 object-cover" />
            </div>
          )}
        </div>

        <button
          onClick={handleCompanyCreation}
          className="w-full py-2 mt-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
        >
          Create Company
        </button>
      </div>
    </div>
  );
};

export default Company;
