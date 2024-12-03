import React, { useState, useEffect } from "react";
import { ref, get, set } from "firebase/database";
import { database } from "../firebase";
import { FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactTelphone, setContactTelphone] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [googleMap, setGoogleMap] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "",
    twitter: "",
    instagram: "",
    facebook: "",
    github: "",
    youtube: "",
    website: "",
    reaProfile: "",
  });
  const [loading, setLoading] = useState(true);
  const [profileSetupComplete, setProfileSetupComplete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const storedUserUID = localStorage.getItem("userUID");

      if (storedUserUID) {
        const userRef = ref(database, "users/" + storedUserUID);

        try {
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const userData = snapshot.val();
            const profile = userData.profile || {};

            setFullName(profile.fullName || "");
            setJobTitle(profile.jobTitle || "");
            setContactEmail(profile.contactEmail || "");
            setContactPhone(profile.contactPhone || "");
            setContactTelphone(profile.contactTelphone || "");
            setProfilePicture(profile.profilePicture || "");
            setGoogleMap(profile.googleMap || "");
            setDateOfBirth(profile.dateOfBirth || "");
            setAddress(profile.address || "");
            setSocialLinks(
              profile.socialLinks || {
                linkedin: "",
                twitter: "",
                instagram: "",
                facebook: "",
                github: "",
                youtube: "",
                website: "",
                reaProfile: "",
              }
            );
            setProfileSetupComplete(userData.profileSetupComplete || false);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    const storedUserUID = localStorage.getItem("userUID");

    if (storedUserUID) {
      const userRef = ref(database, "users/" + storedUserUID);

      try {
        await set(userRef, {
          uid: storedUserUID,
          profileSetupComplete: true,
          profile: {
            fullName,
            jobTitle,
            contactEmail,
            contactPhone,
            contactTelphone,
            profilePicture,
            googleMap,
            dateOfBirth,
            address,
            socialLinks,
          },
        });
        setProfileSetupComplete(true);
        toast.success("Profile updated successfully!");
      } catch (error) {
        toast.error("Failed to update profile. Please try again.");
      }
    }
  };

  const handleSocialLinkChange = (platform, value) => {
    setSocialLinks((prevLinks) => ({
      ...prevLinks,
      [platform]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <p>Loading...</p>;

  //const profileURL = `${window.location.origin}/digitalCard/${localStorage.getItem('userUID')}`;

  return (
    <div className="flex flex-wrap justify-center gap-8 mt-10 pb-10">
      {/* Digital Card Section */}
      <div className="w-full p-8">
        <div className="flex flex-col items-center">
          {profilePicture && (
            <img
              src={profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mb-4"
            />
          )}
          <h2 className="text-2xl font-semibold">{fullName}</h2>
          <p className="text-gray-500">{jobTitle}</p>
          <div className="flex space-x-4 mt-4">
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-500 hover:text-indigo-700 text-2xl"
              >
                <FaLinkedin />
              </a>
            )}
            {socialLinks.twitter && (
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-600 text-2xl"
              >
                <FaTwitter />
              </a>
            )}
            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 hover:text-pink-700 text-2xl"
              >
                <FaInstagram />
              </a>
            )}
          </div>
          {/* Buttons Section */}
          <div className="mt-8 flex space-x-4">
            {/* Preview Button */}
            <button
              onClick={() => {
                const userId = localStorage.getItem("userUID");
                if (userId) {
                  window.open(`/digitalCard/${userId}`, "_blank");
                } else {
                  console.log("UserId not found in localStorage");
                }
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Profile Setup Section */}
      <div className="w-full px-32 md:px-16 sm:px-8">
        <h2 className="text-3xl font-semibold text-center mb-6">
          Setup Your Profile
        </h2>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Full Name */}
            <div className="mb-4">
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            {/* Profile Picture */}
            <div className="mb-4">
              <label
                htmlFor="profilePicture"
                className="block text-sm font-medium text-gray-700"
              >
                Profile Picture
              </label>
              <input
                id="profilePicture"
                type="file"
                accept="image/*"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                onChange={handleFileChange}
              />
            </div>
            {/* Job Title */}
            <div className="mb-4">
              <label
                htmlFor="jobTitle"
                className="block text-sm font-medium text-gray-700"
              >
                Job Title
              </label>
              <input
                id="jobTitle"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
            {/* Email Address */}
            <div className="mb-4">
              <label
                htmlFor="contactEmail"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="contactEmail"
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
            {/* Phone Number */}
            <div className="mb-4">
              <label
                htmlFor="contactPhone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                id="contactPhone"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </div>
            {/* Phone Number */}
            <div className="mb-4">
              <label
                htmlFor="contactTelphone"
                className="block text-sm font-medium text-gray-700"
              >
                Telphone
              </label>
              <input
                id="contactTelphone"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                value={contactTelphone}
                onChange={(e) => setContactTelphone(e.target.value)}
              />
            </div>

            {/* Address */}
            <div className="mb-4">
              <label
                htmlFor="googleMap"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <input
                id="googleMap"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                value={googleMap}
                onChange={(e) => setGoogleMap(e.target.value)}
              />
            </div>
            {/* Date of Birth */}
            <div className="mb-4">
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>
            {/* Address */}
            <div className="mb-4">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                id="address"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
          {/* Social Media Links */}
          <div className="mt-6">
            <h3 className="text-xl font-medium">Social Media Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* LinkedIn */}
              <div className="mb-4">
                <label
                  htmlFor="linkedin"
                  className="block text-sm font-medium text-gray-700"
                >
                  LinkedIn
                </label>
                <input
                  id="linkedin"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                  value={socialLinks.linkedin}
                  onChange={(e) =>
                    handleSocialLinkChange("linkedin", e.target.value)
                  }
                />
              </div>
              {/* Twitter */}
              <div className="mb-4">
                <label
                  htmlFor="twitter"
                  className="block text-sm font-medium text-gray-700"
                >
                  Twitter
                </label>
                <input
                  id="twitter"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                  value={socialLinks.twitter}
                  onChange={(e) =>
                    handleSocialLinkChange("twitter", e.target.value)
                  }
                />
              </div>
              {/* Instagram */}
              <div className="mb-4">
                <label
                  htmlFor="instagram"
                  className="block text-sm font-medium text-gray-700"
                >
                  Instagram
                </label>
                <input
                  id="instagram"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                  value={socialLinks.instagram}
                  onChange={(e) =>
                    handleSocialLinkChange("instagram", e.target.value)
                  }
                />
              </div>
              {/* GitHub */}
              <div className="mb-4">
                <label
                  htmlFor="github"
                  className="block text-sm font-medium text-gray-700"
                >
                  GitHub
                </label>
                <input
                  id="github"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                  value={socialLinks.github || ""}
                  onChange={(e) =>
                    handleSocialLinkChange("github", e.target.value)
                  }
                />
              </div>
              {/* YouTube */}
              <div className="mb-4">
                <label
                  htmlFor="youtube"
                  className="block text-sm font-medium text-gray-700"
                >
                  YouTube
                </label>
                <input
                  id="youtube"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                  value={socialLinks.youtube || ""}
                  onChange={(e) =>
                    handleSocialLinkChange("youtube", e.target.value)
                  }
                />
              </div>
              {/* Website */}
              <div className="mb-4">
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-gray-700"
                >
                  Website
                </label>
                <input
                  id="website"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                  value={socialLinks.website || ""}
                  onChange={(e) =>
                    handleSocialLinkChange("website", e.target.value)
                  }
                />
              </div>
              {/* reaProfile */}
              <div className="mb-4">
                <label
                  htmlFor="reaProfile"
                  className="block text-sm font-medium text-gray-700"
                >
                  Rea Profile
                </label>
                <input
                  id="reaProfile"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                  value={socialLinks.reaProfile || ""}
                  onChange={(e) =>
                    handleSocialLinkChange("website", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-700"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
