import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ref, set, push, query, orderByChild, equalTo, get } from "firebase/database";
import { auth, database } from "../firebase";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import AppLoader from "./AppLoader"; // Assuming you have a loader component

const Company = () => {
  const location = useLocation();
  const { email, password } = location.state || {};

  const [companyName, setCompanyName] = useState("");
  const [logo, setLogo] = useState(null);
  const [logoBase64, setLogoBase64] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null); // Selected company ID
  const navigate = useNavigate();

  const convertToBase64 = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      convertToBase64(file);
    }
  };

  // Autocomplete search logic
  const handleCompanySearch = async (input) => {
    setCompanyName(input);
    if (input.length < 2) {
      setSearchResults([]);
      return;
    }

    const companiesRef = query(ref(database, "companies"));
    const snapshot = await get(companiesRef);

    if (snapshot.exists()) {
      const filteredResults = [];
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        if (data.companyName.toLowerCase().includes(input.toLowerCase())) {
          filteredResults.push({ id: childSnapshot.key, ...data });
        }
      });
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  };

  const handleCompanySelection = (company) => {
    setCompanyName(company.companyName);
    setLogoBase64(company.logo || "");
    setSelectedCompanyId(company.Id);
    setSearchResults([]); // Clear search results
  };

  const handleCompanyCreation = async () => {
    if (!companyName || (!logoBase64 && !selectedCompanyId)) {
      toast.error("Please provide a company name and logo or select an existing company.");
      return;
    }

    setLoading(true); // Start loading

    try {
      let companyId = selectedCompanyId;

      if (!companyId) {
        // Create a new company if none is selected
        const companyRef = push(ref(database, "companies"));
        companyId = companyRef.key;

        await set(companyRef, {
          Id: companyId,
          companyName,
          logo: logoBase64 || "",
          isManuallyEntered: true, // Mark as manually entered
          createdAt: new Date().toISOString(),
        });
      }

      // Create a new user in Firebase Auth with the email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data in Firebase Database
      const userRef = ref(database, "users/" + user.uid);
      await set(userRef, {
        email: user.email,
        uid: user.uid,
        companyId,
        createdAt: new Date().toISOString(),
      });

      setLoading(false); // Stop loading
      navigate("/login"); // Go to login page
      toast.success("Company and user created successfully!");
    } catch (error) {
      setLoading(false); // Stop loading
      console.error("Error creating company:", error);
      toast.error("Error creating company. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      {loading && <AppLoader />} {/* Show loader while loading */}
      <div className="max-w-sm w-full p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Create Company</h2>

        <div className="mb-4 relative">
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
            onChange={(e) => handleCompanySearch(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
          {/* Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute z-10 bg-white hover:bg-gray-100 border border-gray-500 rounded-md w-full mt-1">
              {searchResults.map((company) => (
                <div
                  key={company.id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleCompanySelection(company)}
                >
                  {company.companyName}
                </div>
              ))}
            </div>
          )}
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
          {logoBase64 && (
            <div className="mt-2">
              <img
                src={logoBase64}
                alt="Logo Preview"
                className="w-20 h-20 object-cover"
              />
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
