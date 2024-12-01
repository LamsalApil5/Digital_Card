import React from 'react';

const PersonalBusinessCardDisplay = ({ profile }) => {
  if (!profile) {
    return <p>Loading...</p>; // or handle profile not being available
  }

  return (
    <div className="max-w-xs mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
      {profile.profilePicture ? (
        <img
          src={profile.profilePicture}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4"></div> // Placeholder for profile picture
      )}
      <h2 className="text-xl font-bold text-gray-800">{profile.fullName || 'Name not available'}</h2>
      <h3 className="text-lg text-gray-500">{profile.jobTitle || 'Job Title not available'}</h3>
      <p className="text-sm text-gray-600 mt-2">{profile.bio || 'Bio not available'}</p>
      <div className="mt-4">
        <p className="text-sm text-gray-700"><strong>Email:</strong> {profile.contactEmail || 'Email not available'}</p>
        <p className="text-sm text-gray-700"><strong>Phone:</strong> {profile.contactPhone || 'Phone not available'}</p>
      </div>
      
      <div className="mt-4 space-x-3">
        {profile.socialLinks && profile.socialLinks.linkedin && (
          <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            LinkedIn
          </a>
        )}
        {profile.socialLinks && profile.socialLinks.twitter && (
          <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            Twitter
          </a>
        )}
        {profile.socialLinks && profile.socialLinks.instagram && (
          <a href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">
            Instagram
          </a>
        )}
      </div>
    </div>
  );
};

export default PersonalBusinessCardDisplay;
