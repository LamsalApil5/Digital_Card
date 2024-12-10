import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ref, set, push, update } from "firebase/database";
import { database } from "../firebase";
import { toast } from "react-toastify";

const Company = () => {
  const { userUID } = useParams();
  const [companyName, setCompanyName] = useState("");
  const [logo, setLogo] = useState(null);
  const [logoBase64, setLogoBase64] = useState("");
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

  const handleCompanyCreation = async () => {
    if (!companyName || !logoBase64) {
      toast.error("Please provide a company name and logo.");
      return;
    }

    try {
      const companyRef = push(ref(database, "companies"));
      const companyId = companyRef.key;

      await set(companyRef, {
        Id: companyId,
        companyName,
        logo: logoBase64,
      });

      const userRef = ref(database, `users/${userUID}`);
      await update(userRef, {
        companyId,
      });

      localStorage.setItem("userId", userUID);
      toast.success("Company created successfully!");
      navigate("/profile");
    } catch (error) {
      toast.error("Error creating company. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-md w-full p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Create Company</h2>

        <div className="mb-4">
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
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
          <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
            Company Logo
          </label>
          <input
            id="logo"
            type="file"
            onChange={handleLogoChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            accept="image/*"
          />
        </div>

        <button onClick={handleCompanyCreation} className="w-full py-2 mt-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600">
          Create Company
        </button>
      </div>
    </div>
  );
};

export default Company;
