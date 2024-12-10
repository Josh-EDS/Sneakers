import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

const DisplayAllCookies = () => {
  const [allCookies, setAllCookies] = useState({});

  // Retrieve all cookies when the component mounts
  useEffect(() => {
    const cookies = Cookies.get(); // Get all cookies
    const bytes = CryptoJS.AES.decrypt(Cookies.get("Token"), '92d7a9a5942a4a7c9b18d5046a5f8fa3b7f0bb7db5c64f2a4675d7d8a2d67f51'); const decodedData = bytes.toString(CryptoJS.enc.Utf8).split(':'); const decodedEmail = decodedData[0], decodedCredentials = decodedData[1];
    console.log(decodedData[0])
    setAllCookies(cookies); // Set all cookies in the state
  }, []);

  return (
    <div className="cookies-display">
      <h1 className="text-2xl font-bold text-center mb-6">All Cookies</h1>
      <div className="text-center">
        {Object.keys(allCookies).length > 0 ? (
          <ul>
            {Object.keys(allCookies).map((cookieName) => (
              <li key={cookieName} className="mb-2">
                <strong>{cookieName}:</strong> {allCookies[cookieName]}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No cookies found.</p>
        )}
      </div>
    </div>
  );
};

export default DisplayAllCookies;
