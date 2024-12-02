import React, { useState, useEffect } from 'react';
import { ref, get, set } from 'firebase/database';
import { database } from '../firebase';

const ProfileSetup = () => {
  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [socialLinks, setSocialLinks] = useState({ linkedin: '', twitter: '', instagram: '' });
  const [loading, setLoading] = useState(true);
  const [profileSetupComplete, setProfileSetupComplete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const storedUserUID = localStorage.getItem('userUID');
      
      if (storedUserUID) {
        const userRef = ref(database, 'users/' + storedUserUID);

        try {
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const userData = snapshot.val();
            const profile = userData.profile || {};

            setFullName(profile.fullName || '');
            setJobTitle(profile.jobTitle || '');
            setContactEmail(profile.contactEmail || '');
            setContactPhone(profile.contactPhone || '');
            setProfilePicture(profile.profilePicture || '');
            setDateOfBirth(profile.dateOfBirth || '');
            setAddress(profile.address || '');
            setSocialLinks(profile.socialLinks || { linkedin: '', twitter: '', instagram: '' });
            setProfileSetupComplete(userData.profileSetupComplete || false);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    const storedUserUID = localStorage.getItem('userUID');

    if (storedUserUID) {
      const userRef = ref(database, 'users/' + storedUserUID);

      try {
        await set(userRef, {
          uid: storedUserUID,
          profileSetupComplete: true, // Mark profile setup as complete
          profile: {
            fullName,
            jobTitle,
            contactEmail,
            contactPhone,
            profilePicture,
            dateOfBirth,
            address,
            socialLinks,
          },
        });
        setProfileSetupComplete(true); // Update the state to reflect profile setup completion
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Error saving data:', error);
        alert('Failed to update profile. Please try again.');
      }
    }
  };

  const handleSocialLinkChange = (platform, value) => {
    setSocialLinks((prevLinks) => ({
      ...prevLinks,
      [platform]: value,
    }));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="w-full flex justify-center mt-10">
      <div className="w-full max-w-3xl p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold text-center mb-6">Setup Your Profile</h2>

          <form>
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                id="fullName"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Job Title</label>
              <input
                id="jobTitle"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                id="contactEmail"
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                id="contactPhone"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">Profile Picture URL</label>
              <input
                id="profilePicture"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                value={profilePicture}
                onChange={(e) => setProfilePicture(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                id="dateOfBirth"
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <input
                id="address"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-medium">Social Media Links</h3>
              <div className="mb-4">
                <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">LinkedIn</label>
                <input
                  id="linkedin"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                  value={socialLinks.linkedin}
                  onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">Twitter</label>
                <input
                  id="twitter"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                  value={socialLinks.twitter}
                  onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">Instagram</label>
                <input
                  id="instagram"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                  value={socialLinks.instagram}
                  onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Save Profile
            </button>
          </form>
       
      </div>
    </div>
  );
};

export default ProfileSetup;
