import React, { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { database } from "../firebase";
import {
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaPhone,
  FaPhoneSquare,
  FaMailchimp,
  FaQrcode,
  FaLink,
} from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";
import { useParams } from "react-router-dom";
import manImage from "../man.png";
import companyLogo from "../companylogo.png";

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
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        No profile data available.
      </div>
    );
  }

  const profileURL = `${window.location.origin}/digitalCard/${userUID}`;

  return (
    <div className="min-h-screen bg-orange-500 text-white ">
      <div className="section relative text-center mb-8 w-full max-w-sm mx-auto shadow-lg">
        <div
          className="bg-center bg-cover bg-no-repeat w-full min-h-[20rem] sm:min-h-[25rem] md:min-h-[30rem]"
          style={{
            backgroundImage: `url(${profile.profilePicture || manImage})`,
          }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-orange-500 via-transparent to-transparent rounded-lg"></div>
        </div>

        {/* Profile Details Section - Left-Aligned */}
        <div
          className="absolute top-2/4 left-0 w-full p-4 text-white text-left flex flex-col "
          style={{ height: "calc(100% - 80px)" }}
        >
          {/* Profile Name and Information */}
          <h1 className="text-3xl font-semibold mb-2">
            {profile.fullName || "Full Name"}
          </h1>
          <p className="mb-1">Multi Dynamic</p>
          <p className="mb-4">{profile.address || "No address available"}</p>

          {/* Company Logo Aligned to Left */}
          <div className="mb-4 flex justify-start">
            <img
              src={companyLogo}
              alt="Company logo for Multi Dynamic"
              className="h-8"
            />
          </div>

          {/* Contact Icons - Left Aligned */}
          <div>
            <ul className="flex space-x-4 justify-start">
              <li>
                <a href={`tel:${profile.contactPhone}`} className="qr_cc_card">
                  <FaPhone className="w-6 h-6 text-blue-600" />
                </a>
              </li>
              <li>
                <a
                  href={`tel:${profile.contactTelphone}`}
                  className="qr_cc_card"
                >
                  <FaPhoneSquare className="w-6 h-6 text-blue-600" />
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${profile.contactEmail}`}
                  className="qr_cc_card"
                >
                  <FaMailchimp className="w-6 h-6 text-blue-600" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 max-w-7xl mx-auto">
        {/* QR Code Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-orange-600 rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-100"
        >
          <FaQrcode className="w-6 h-6" />
        </button>

        {/* Copy Link Button */}
        <button
          onClick={() =>
            navigator.clipboard.writeText(profile.link || "default link")
          }
          className="bg-white text-orange-600 rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-100"
        >
          <FaLink className="w-6 h-6" />
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
