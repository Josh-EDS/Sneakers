import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";

async function getProfilePic(email) {
  const response = await fetch("http://localhost:1337/api/user-ids");
  const data = await response.json();
  const user = data.data.find((user) => user.Email === email);
  return user ? user.Profile_pic : null;
}

const Navbar = () => {
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      try {
        const [decodedEmail] = CryptoJS.AES.decrypt(
          token,
          "92d7a9a5942a4a7c9b18d5046a5f8fa3b7f0bb7db5c64f2a4675d7d8a2d67f51"
        )
          .toString(CryptoJS.enc.Utf8)
          .split(":");
        
        getProfilePic(decodedEmail).then(setProfilePic);
      } catch {
        setProfilePic(null); // If token decoding fails, reset profilePic to null
      }
    }
  }, []);

  return (
    <div className="flex justify-between items-center p-4 bg-gray-100">
      {/* Logo */}
      <div className="flex items-center space-x-12">
        <Link to="/" className="flex items-center" data-discover="true">
          <img src="/src/assets/Patissier.png" alt="Logo Patissier" className="h-12" />
        </Link>
      </div>

      {/* Navbar Links */}
      <nav className="flex items-center space-x-10">
        <Link to="/" className="relative group text-black no-underline">
          Home
          <span className="absolute left-0 bottom-[-2px] h-[2px] bg-black w-0 group-hover:w-full transition-all duration-200 ease-in-out"></span>
        </Link>
        {profilePic ? (
          <Link
            to="/profile"
            className="relative group text-black no-underline"
          >
            <img
              src={profilePic}
              alt="Profile"
              className="w-14 h-14 rounded-full object-cover border-4 border-gray-200"
            />
          </Link>
        ) : (
          <Link
            to="/profile"
            className="relative group text-black no-underline"
          >
            Se connecter
            <span className="absolute left-0 bottom-[-2px] h-[2px] bg-black w-0 group-hover:w-full transition-all duration-200 ease-in-out"></span>
          </Link>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
