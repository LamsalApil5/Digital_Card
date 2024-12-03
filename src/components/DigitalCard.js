import React, { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { database } from "../firebase";
import { FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";
import { useParams } from "react-router-dom";

const DigitalCard = () => {
  const { userUID } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userUID) {
        console.error("No userUID found in URL");
        setLoading(false);
        return;
      }

      const userRef = ref(database, `users/${userUID}`);
      try {
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setProfile(snapshot.val().profile || {});
        } else {
          console.error("User profile not found");
          setProfile(null);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userUID]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
  }

  if (!profile) {
    return <div className="flex justify-center items-center h-screen text-xl">No profile data available.</div>;
  }

  const profileURL = `${window.location.origin}/digitalCard/${userUID}`;

  return (
    <div className="min-h-screen bg-orange-500 text-white flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-6">
        <div className="text-center">
          {profile.profilePicture ? (
            <img
              src={profile.profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4 flex items-center justify-center text-black">
              <span>No Pic</span>
            </div>
          )}
          <h2 className="text-2xl font-bold">{profile.fullName || "Full Name"}</h2>
          <p className="text-sm">{profile.jobTitle || "Job Title"}</p>
          <p className="text-sm mt-2">{profile.contactEmail || "Email not available"}</p>
          <p className="text-sm">{profile.contactPhone || "Phone not available"}</p>
        </div>
        <div className="flex justify-center space-x-4 mt-4">
          {profile.socialLinks?.linkedin && (
            <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="w-6 h-6 text-blue-600" />
            </a>
          )}
          {profile.socialLinks?.twitter && (
            <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
              <FaTwitter className="w-6 h-6 text-blue-400" />
            </a>
          )}
          {profile.socialLinks?.instagram && (
            <a href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
              <FaInstagram className="w-6 h-6 text-pink-600" />
            </a>
          )}
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-6 bg-white text-orange-600 rounded-full px-4 py-2 hover:bg-gray-100 w-full"
        >
          Generate QR Code
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-black"
            >
              X
            </button>
            <QRCodeCanvas value={profileURL} size={200} />
            <p className="text-center mt-4">Scan to view this profile</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalCard;
