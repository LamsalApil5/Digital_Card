import React, { useState, useEffect } from "react";
import { ref, get, query } from "firebase/database";
import { database } from "../firebase";
import { FaPhoneSquare, FaQrcode } from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";
import { FaSave } from "react-icons/fa";
import { useParams } from "react-router-dom";
import manImage from "../man.png";

const DigitalCard = () => {
  const { companyName, userName } = useParams();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    // Parse the userName only when it changes or on initial mount
    const nameParts = userName.split("-");

    if (nameParts.length === 3) {
      setFirstName(nameParts[0]);
      setMiddleName(nameParts[1]);
      setLastName(nameParts[2]);
    } else if (nameParts.length === 2) {
      setFirstName(nameParts[0]);
      setMiddleName(""); // No middle name
      setLastName(nameParts[1]);
    } else if (nameParts.length === 1) {
      setFirstName(nameParts[0]);
      setMiddleName(""); // No middle name
      setLastName(""); // No last name
    } else {
      console.error("Invalid userName format");
    }
  }, [userName]); // Only run when userName changes

  useEffect(() => {
    const fetchProfile = async () => {
      if (!companyName && !firstName) {
        console.error("Invalid URL parameters");
        setIsLoading(false);
        return;
      }
  
      try {
        // Step 2: Fetch profile from the profiles table
        const profilesRef = ref(database, "profiles");
        const profileQuery = query(profilesRef);
        const profileSnapshot = await get(profileQuery);
  
        if (profileSnapshot.exists()) {
          const profiles = Object.values(profileSnapshot.val());          
          const matchedProfile = profiles.find(
            (p) =>
              p.firstName === firstName &&
              (p.middleName || "") === (middleName || "") &&
              p.lastName === lastName &&
              p.companyName === companyName
          );
          
          if (matchedProfile) {
            setProfile(matchedProfile);
          } else {
            setProfile(null);
          }
        } else {
          console.error("No profiles found for the company");
          setProfile(null);
        }
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchProfile();
  }, [companyName, userName, firstName, middleName, lastName]);
  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }
  const saveContact = () => {
    // Check if at least one phone number exists
    if (profile.contactPhone || profile.contactTelphone || profile.fullName) {
      // Create the vCard content (VCF format)
      let vCardData = `BEGIN:VCARD
  VERSION:3.0
  FN:${profile.fullName}
  `;

      // Add phone numbers to the vCard (if available)
      if (profile.contactName) {
        vCardData += `TEL;TYPE=NAME:${profile.fullName}\n`; // Mobile number
      }
      if (profile.contactPhone) {
        vCardData += `TEL;TYPE=WORK:${profile.contactPhone}\n`; // Mobile number
      }
      if (profile.contactTelphone) {
        vCardData += `TEL;TYPE=HOME:${profile.contactTelphone}\n`; // Work number
      }

      vCardData += `END:VCARD`;

      // Create a Blob with the vCard data and specify the MIME type as vCard
      const blob = new Blob([vCardData], { type: "text/vcard" });

      // Create an anchor element to trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);

      link.download = `${profile.fullName || "contact"}.vcf`;
      link.click();

      navigator.clipboard
        .writeText(profile.contactPhone)
        .then(() => {
          setIsSaved(true);
          setTimeout(() => setIsSaved(false), 2000);
        })
        .catch((error) => {
          console.error("Error copying to clipboard: ", error);
          alert("Failed to save contact. Please try again.");
        });
    } else {
      alert("At least one phone number is required.");
    }
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        No profile data available.
      </div>
    );
  }
  // Build the URL with dynamic parameters
  const middleNameSegment = middleName ? middleName : ""; // Keep empty string if no middleName
  const profileURL = `${
    window.location.origin
  }/digitalCard/${companyName}/${firstName}-${
    middleNameSegment ? middleNameSegment + "-" : ""
  }${lastName}`;

  return (
    <div className="min-h-screen bg-orange-100 pt-10 pb-20 text-white ">
      <div className="section relative text-center mb-8 w-full max-w-sm mx-auto rounded-lg mt-5 shadow-xl">
        {/* Background Image Section */}
        <div
          className="bg-center bg-cover bg-no-repeat w-full min-h-[35rem] sm:min-h-[25rem] md:min-h-[30rem] rounded-lg relative"
          style={{
            backgroundImage: `url(${profile.profilePicture || manImage})`,
          }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 via-transparent/50 to-transparent/0 rounded-lg"></div>

          {/* Profile Details Section - Positioned at Bottom */}
          <div className="absolute bottom-0 w-full p-4 text-white text-left flex flex-col bg-gradient-to-t from-black via-transparent to-transparent rounded-b-lg">
            {/* Profile Name and Information */}
            <h1 className="text-3xl font-semibold mb-2">
              {profile.firstName} {profile.middleName} {profile.lastName}
            </h1>
            <p className="mb-1">{profile.companyName}</p>
            <p className="mb-4">{profile.address || "No address available"}</p>

            {/* Contact Icons - Left Aligned */}
            <div>
              <ul className="flex space-x-4">
                {profile.contactPhone && (
                  <li>
                    <a
                      href={`tel:${profile.contactPhone}`}
                      className="btn w-12 h-12 bg-[#3d0fd5] rounded-full flex items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </a>
                  </li>
                )}
                {profile.contactTelphone && (
                  <li>
                    <a
                      href={`tel:${profile.contactTelphone}`}
                      className="btn w-12 h-12 bg-[#3d0fd5] rounded-full flex items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </a>
                  </li>
                )}
                {profile.contactEmail && (
                  <li>
                    <a
                      href={`mailto:${profile.contactEmail}`}
                      className="btn w-12 h-12 bg-[#3d0fd5] rounded-full flex items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6 mb-4 max-w-sm mx-auto">
        <div class="flex items-center gap-4 mb-6">
          <FaPhoneSquare className="w-6 h-6 text-black" />
          <span class="text-lg  text-black">Contact Me</span>
        </div>

        <div className="space-y-6">
          {(profile.contactTelphone || profile.contactPhone) && (
            <div>
              <h3 class="text-black mb-1">Call Me</h3>
              {profile.contactTelphone ? (
                <p className="text-gray-700">
                  {profile.contactPhone} +{profile.contactTelphone}
                </p>
              ) : (
                <p className="text-gray-700">{profile.contactPhone}</p>
              )}
            </div>
          )}
          {profile.contactEmail && (
            <div>
              <h3 className="text-black mb-1">Email</h3>
              <p className="text-gray-700">{profile.contactEmail}</p>
            </div>
          )}
          {profile.address && (
            <div>
              <h3 class="text-black mb-1">Address</h3>
              <p class="text-gray-700">{profile.address}</p>
            </div>
          )}
          {profile.googleMap && (
            <div className="w-full bg-white p-4">
              <button
                className="bg-[#ad6c26] text-white px-4 py-2 rounded flex items-center justify-center gap-2 w-full max-w-sm mx-auto sm:px-6 sm:py-3 sm:text-base"
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${profile.googleMap}`,
                    "_blank"
                  )
                }
                rel="noreferrer noopener"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                Direction
              </button>
            </div>
          )}
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6 mb-4 max-w-sm mx-auto">
        <h2 class="text-xl mb-4 text-black text-left font-bold">
          My Quick Links
        </h2>
        {/* 
        <!-- Social Media Links --> */}
        {/* LinkedIn */}
        {profile.socialLinks.linkedin && (
          <a
            href={profile.socialLinks.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center justify-between p-2 hover:bg-gray-200 rounded"
          >
            <div className="flex items-center gap-3 text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="30"
                height="30"
                viewBox="0 0 50 50"
              >
                <path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z"></path>
              </svg>
              <p className="font-medium text-black">LinkedIn</p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}

        {/* Twitter */}
        {profile.socialLinks.twitter && (
          <a
            href={profile.socialLinks.twitter}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center justify-between p-2 hover:bg-gray-200 rounded"
          >
            <div className="flex items-center gap-3 text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="30"
                height="30"
                viewBox="0 0 50 50"
              >
                <path d="M 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 L 11 4 z M 13.085938 13 L 21.023438 13 L 26.660156 21.009766 L 33.5 13 L 36 13 L 27.789062 22.613281 L 37.914062 37 L 29.978516 37 L 23.4375 27.707031 L 15.5 37 L 13 37 L 22.308594 26.103516 L 13.085938 13 z M 16.914062 15 L 31.021484 35 L 34.085938 35 L 19.978516 15 L 16.914062 15 z"></path>
              </svg>
              <p className="font-medium text-black">Twitter</p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}

        {/* Instagram */}
        {profile.socialLinks.instagram && (
          <a
            href={profile.socialLinks.instagram}
            target="_blank"
            rel="noreferrer noopener"
            class="flex items-center justify-between p-2 hover:bg-gray-200 rounded"
          >
            <div class="flex items-center gap-3 text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="30"
                height="30"
                viewBox="0 0 50 50"
              >
                <path d="M 16 3 C 8.83 3 3 8.83 3 16 L 3 34 C 3 41.17 8.83 47 16 47 L 34 47 C 41.17 47 47 41.17 47 34 L 47 16 C 47 8.83 41.17 3 34 3 L 16 3 z M 37 11 C 38.1 11 39 11.9 39 13 C 39 14.1 38.1 15 37 15 C 35.9 15 35 14.1 35 13 C 35 11.9 35.9 11 37 11 z M 25 14 C 31.07 14 36 18.93 36 25 C 36 31.07 31.07 36 25 36 C 18.93 36 14 31.07 14 25 C 14 18.93 18.93 14 25 14 z M 25 16 C 20.04 16 16 20.04 16 25 C 16 29.96 20.04 34 25 34 C 29.96 34 34 29.96 34 25 C 34 20.04 29.96 16 25 16 z"></path>
              </svg>
              <p class="font-medium text-black">Instagram</p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}

        {/* Facebook */}
        {profile.socialLinks.facebook && (
          <a
            href={profile.socialLinks.facebook}
            target="_blank"
            rel="noreferrer noopener"
            class="flex items-center justify-between p-2 hover:bg-gray-200 rounded"
          >
            <div class="flex items-center gap-3 text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="30"
                height="30"
                viewBox="0 0 50 50"
              >
                <path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M37,19h-2c-2.14,0-3,0.5-3,2 v3h5l-1,5h-4v15h-5V29h-4v-5h4v-3c0-4,2-7,6-7c2.9,0,4,1,4,1V19z"></path>
              </svg>
              <p class="font-medium text-black">Facebook</p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}

        {/* GitHub */}
        {profile.socialLinks.github && (
          <a
            href={profile.socialLinks.github}
            target="_blank"
            rel="noreferrer noopener"
            class="flex items-center justify-between p-2 hover:bg-gray-200 rounded"
          >
            <div class="flex items-center gap-3 text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="30"
                height="30"
                viewBox="0 0 50 50"
              >
                <path d="M17.791,46.836C18.502,46.53,19,45.823,19,45v-5.4c0-0.197,0.016-0.402,0.041-0.61C19.027,38.994,19.014,38.997,19,39 c0,0-3,0-3.6,0c-1.5,0-2.8-0.6-3.4-1.8c-0.7-1.3-1-3.5-2.8-4.7C8.9,32.3,9.1,32,9.7,32c0.6,0.1,1.9,0.9,2.7,2c0.9,1.1,1.8,2,3.4,2 c2.487,0,3.82-0.125,4.622-0.555C21.356,34.056,22.649,33,24,33v-0.025c-5.668-0.182-9.289-2.066-10.975-4.975 c-3.665,0.042-6.856,0.405-8.677,0.707c-0.058-0.327-0.108-0.656-0.151-0.987c1.797-0.296,4.843-0.647,8.345-0.714 c-0.112-0.276-0.209-0.559-0.291-0.849c-3.511-0.178-6.541-0.039-8.187,0.097c-0.02-0.332-0.047-0.663-0.051-0.999 c1.649-0.135,4.597-0.27,8.018-0.111c-0.079-0.5-0.13-1.011-0.13-1.543c0-1.7,0.6-3.5,1.7-5c-0.5-1.7-1.2-5.3,0.2-6.6 c2.7,0,4.6,1.3,5.5,2.1C21,13.4,22.9,13,25,13s4,0.4,5.6,1.1c0.9-0.8,2.8-2.1,5.5-2.1c1.5,1.4,0.7,5,0.2,6.6c1.1,1.5,1.7,3.2,1.6,5 c0,0.484-0.045,0.951-0.11,1.409c3.499-0.172,6.527-0.034,8.204,0.102c-0.002,0.337-0.033,0.666-0.051,0.999 c-1.671-0.138-4.775-0.28-8.359-0.089c-0.089,0.336-0.197,0.663-0.325,0.98c3.546,0.046,6.665,0.389,8.548,0.689 c-0.043,0.332-0.093,0.661-0.151,0.987c-1.912-0.306-5.171-0.664-8.879-0.682C35.112,30.873,31.557,32.75,26,32.969V33 c2.6,0,5,3.9,5,6.6V45c0,0.823,0.498,1.53,1.209,1.836C41.37,43.804,48,35.164,48,25C48,12.318,37.683,2,25,2S2,12.318,2,25 C2,35.164,8.63,43.804,17.791,46.836z"></path>
              </svg>
              <p class="font-medium text-black">GitHub</p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}

        {/* YouTube */}
        {profile.socialLinks.youtube && (
          <a
            href={profile.socialLinks.youtube}
            target="_blank"
            rel="noreferrer noopener"
            class="flex items-center justify-between p-2 hover:bg-gray-200 rounded"
          >
            <div class="flex items-center gap-3 text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="30"
                height="30"
                viewBox="0 0 50 50"
              >
                <path d="M 44.898438 14.5 C 44.5 12.300781 42.601563 10.699219 40.398438 10.199219 C 37.101563 9.5 31 9 24.398438 9 C 17.800781 9 11.601563 9.5 8.300781 10.199219 C 6.101563 10.699219 4.199219 12.199219 3.800781 14.5 C 3.398438 17 3 20.5 3 25 C 3 29.5 3.398438 33 3.898438 35.5 C 4.300781 37.699219 6.199219 39.300781 8.398438 39.800781 C 11.898438 40.5 17.898438 41 24.5 41 C 31.101563 41 37.101563 40.5 40.601563 39.800781 C 42.800781 39.300781 44.699219 37.800781 45.101563 35.5 C 45.5 33 46 29.398438 46.101563 25 C 45.898438 20.5 45.398438 17 44.898438 14.5 Z M 19 32 L 19 18 L 31.199219 25 Z"></path>
              </svg>
              <p class="font-medium text-black">YouTube</p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}

        {/* Website */}
        {profile.socialLinks.website && (
          <a
            href={profile.socialLinks.website}
            target="_blank"
            rel="noreferrer noopener"
            class="flex items-center justify-between p-2 hover:bg-gray-200 rounded"
          >
            <div class="flex items-center gap-3 text-black">
              <svg
                width="30px"
                height="30px"
                viewBox="0 0 64 64"
                xmlns="http://www.w3.org/2000/svg"
                stroke-width="3"
                stroke="#000000"
                fill="none"
              >
                <path d="M39.93,55.72A24.86,24.86,0,1,1,56.86,32.15a37.24,37.24,0,0,1-.73,6" />
                <path d="M37.86,51.1A47,47,0,0,1,32,56.7" />
                <path d="M32,7A34.14,34.14,0,0,1,43.57,30a34.07,34.07,0,0,1,.09,4.85" />
                <path d="M32,7A34.09,34.09,0,0,0,20.31,32.46c0,16.2,7.28,21,11.66,24.24" />
                <line x1="10.37" y1="19.9" x2="53.75" y2="19.9" />
                <line x1="32" y1="6.99" x2="32" y2="56.7" />
                <line x1="11.05" y1="45.48" x2="37.04" y2="45.48" />
                <line x1="7.14" y1="32.46" x2="56.86" y2="31.85" />
                <path d="M53.57,57,58,52.56l-8-8,4.55-2.91a.38.38,0,0,0-.12-.7L39.14,37.37a.39.39,0,0,0-.46.46L42,53.41a.39.39,0,0,0,.71.13L45.57,49Z" />
              </svg>
              <p class="font-medium text-black">Website</p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}

        {/* REA Profile */}
        {profile.socialLinks.reaProfile && (
          <a
            href={profile.socialLinks.reaProfile}
            target="_blank"
            rel="noreferrer noopener"
            class="flex items-center justify-between p-2 hover:bg-gray-200 rounded"
          >
            <div class="flex items-center gap-3 text-black">
              <svg
                fill="#000000"
                width="30"
                height="30"
                viewBox="0 0 50 50"
                version="1.2"
                baseProfile="tiny"
                xmlns="http://www.w3.org/2000/svg"
                overflow="inherit"
              >
                <path d="M14.237 39.5h30.483v-26.081h-30.483v26.081zm15.489-23.485l10.99 9.598h-2.769v11.516h-6.436v-8.129h-4.065v8.129h-6.096v-11.516h-2.84l11.216-9.598zm-18.876-9.031v-5.966h-6.774v48.982h6.774v-39.967h35.226v-3.049z" />
              </svg>
              <p class="font-medium text-black">REA Profile</p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-sm mx-auto">
        <div className="mb-4">
          <h3 className="text-black text-lg font-semibold mb-2">
            Location Preview
          </h3>
          <div className="rounded-lg overflow-hidden">
            <iframe
              className="w-full h-64"
              src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(
                profile.googleMap
              )}`}
              allowFullScreen
              aria-hidden="false"
              title={`Map of ${profile.googleMap}`}
            ></iframe>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 left-10 z-50 pb-5 max-w-7xl mx-auto md:w-auto space-x-2">
        {/* QR Code Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-orange-600 rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-100"
        >
          <FaQrcode className="w-6 h-6" />
        </button>
      </div>

      <div className="fixed bottom-6 right-10 z-50 pb-5 max-w-7xl mx-auto flex  items-start justify-end space-x-2">
        <div className=" text-green-600 rounded-full flex items-center space-x-2 group">
          <span className="text-sm font-medium flex items-center justify-center py-1 px-2 rounded-full bg-white text-transparent group-hover:text-orange-600 group-hover:bg-white transition-all duration-300 transform group-hover:scale-100 opacity-0 group-hover:opacity-100">
            Save Contact
          </span>
          <button
            onClick={saveContact}
            className="bg-white text-orange-600 rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-100"
          >
            {isSaved ? (
              <FaSave className="w-6 h-6" />
            ) : (
              <FaSave className="w-6 h-6" />
            )}
          </button>
        </div>
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
            <p className="text-center mt-4 text-gray-500">
              Scan to view this profile
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalCard;
