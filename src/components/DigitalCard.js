import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../firebase'; 
import { FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa'; // FontAwesome icons
import {QRCodeCanvas} from 'qrcode.react'; // Ensure default import

const DigitalCard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  useEffect(() => {
    const fetchUserProfile = async () => {
      const storedUserUID = localStorage.getItem('userUID');
      if (!storedUserUID) {
        console.error('No userUID found in local storage');
        setLoading(false);
        return;
      }

      const userRef = ref(database, `users/${storedUserUID}`);
      try {
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          console.log('User Data:', userData); // Check what data is fetched from Firebase
          setProfile(userData.profile || {}); // Set the profile data, if available
        } else {
          console.error('User profile not found');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!profile) {
    return <p>No profile data available.</p>;
  }

  const profileURL = `${window.location.origin}/digitalCard/${localStorage.getItem('userUID')}`;

  const handleModalClose = () => {
    setIsModalOpen(false); // Close the modal
  };

  const handleModalOpen = () => {
    setIsModalOpen(true); // Open the modal
  };

  return (
    <div className="flex justify-center items-center flex-col">
      {/* Profile Card */}
      <div className="max-w-sm mx-auto rounded-lg shadow-lg overflow-hidden border-4 border-indigo-500 mb-8">
        <div className="flex justify-center mt-4">
          {profile.profilePicture ? (
            <img
              src={profile.profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-white border-4 border-indigo-500">
              <span className="text-xl font-bold">No Pic</span>
            </div>
          )}
        </div>
        <div className="text-center p-6">
          <h2 className="text-2xl font-semibold text-gray-800">{profile.fullName || 'Full Name'}</h2>
          <p className="text-lg text-gray-500 mt-2">{profile.jobTitle || 'Job Title'}</p>
          <p className="text-sm text-gray-600 mt-4">{profile.contactEmail || 'Email not available'}</p>
          <p className="text-sm text-gray-600">{profile.contactPhone || 'Phone not available'}</p>
          <p className="text-sm text-gray-600 mt-2">{profile.address || 'Address not available'}</p>
        </div>
        <div className="flex justify-center mb-4 space-x-4">
          {profile.socialLinks?.linkedin && (
            <a
              href={profile.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              <FaLinkedin className="w-6 h-6" />
            </a>
          )}
          {profile.socialLinks?.twitter && (
            <a
              href={profile.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              <FaTwitter className="w-6 h-6" />
            </a>
          )}
          {profile.socialLinks?.instagram && (
            <a
              href={profile.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:underline"
            >
              <FaInstagram className="w-6 h-6" />
            </a>
          )}
        </div>
      </div>

      {/* QR Button Outside the Card */}
      <div className="flex justify-center mb-4">
        <button
          onClick={handleModalOpen}
          className="px-6 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
        >
          Generate QR Code
        </button>
      </div>

      {/* Modal for QR Code */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-end">
              <button onClick={handleModalClose} className="text-xl font-bold">X</button>
            </div>
            <div className="flex justify-center mb-4">
              <QRCodeCanvas value={profileURL} size={256} />
            </div>
            <p className="text-center text-sm text-gray-500">Scan this QR code to access your digital card.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalCard;