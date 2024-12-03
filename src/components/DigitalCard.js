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
    <div className="min-h-screen bg-orange-500 pt-10 pb-20 text-white ">
      <div className="section relative text-center pt-10 mb-8 w-full max-w-sm mx-auto rounded-lg shadow-lg">
        <div
          className="bg-center bg-cover bg-no-repeat pt-5 w-full min-h-[20rem] sm:min-h-[25rem] md:min-h-[30rem]"
          style={{
            backgroundImage: `url(${profile.profilePicture || manImage})`,
          }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-orange-500 via-transparent to-transparent rounded-lg"></div>
        </div>

        {/* Profile Details Section - Left-Aligned */}
        <div
          className="absolute top-1/4 sm:top-1/3 md:top-2/4 left-0 w-full p-4 text-white text-left flex flex-col " >
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
                <a href={`tel:${profile.contactPhone}`} className="btn w-12 h-12 bg-[#3d0fd5] rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                
                </a>
              </li>
              <li>
                <a
                  href={`tel:${profile.contactTelphone}`}
                  className="btn w-12 h-12 bg-[#3d0fd5] rounded-full flex items-center justify-center"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${profile.contactEmail}`}
                  className="btn w-12 h-12 bg-[#3d0fd5]  rounded-full flex items-center justify-center"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-lg p-6 mb-4 max-w-sm mx-auto">
        <div class="flex items-center gap-4 mb-6">
          <FaPhoneSquare className="w-6 h-6 text-black" />
          <span class="text-lg  text-black">Contact Me</span>
        </div>

        <div class="space-y-6">
          <div>
            <h3 class="text-black mb-1">Call Me</h3>
            <p class="text-gray-700">{profile.contactPhone}</p>
          </div>
          <div>
            <h3 class="text-black mb-1">Email</h3>
            <p class="text-gray-700">{profile.contactEmail}</p>
          </div>
          <div>
            <h3 class="text-black mb-1">Address</h3>
            <p class="text-gray-700">{profile.address}</p>
          </div>
          <button class="bg-[#ad6c26] text-white px-4 py-2 rounded flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            Direction
          </button>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-lg p-6 mb-4 max-w-sm mx-auto">
        <h2 class="text-xl font-semibold mb-4 text-black">Web Links</h2>
        <a
          href="https://www.google.com/maps"
          class="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
        >
          <div class="flex items-center gap-3 text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <div>
              <p class="font-medium text-black">Multi Dynamic</p>
              <p class="text-sm text-gray-700">{profile.address}</p>
            </div>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      </div>
      <div className="fixed bottom-6 left-10 z-50 pb-5 max-w-7xl mx-auto">
        {/* QR Code Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-orange-600 rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-100"
        >
          <FaQrcode className="w-6 h-6" />{" "}
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 flex flex-col rounded-lg shadow-lg">
          {/* Button inside the modal */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-xl text-white bg-black rounded-full w-8 h-8 flex items-center justify-center ml-auto mb-4"
          >
            X
          </button>
          <QRCodeCanvas value={profileURL} size={200} />
          <p className="text-center mt-4 text-gray-500">Scan to view this profile</p>
        </div>
      </div>
      
      
      )}
    </div>
  );
};

export default DigitalCard;
