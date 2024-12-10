import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Camera, 
  Save, 
  ArrowLeft 
} from 'lucide-react';
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";

const EditProfilePage = () => {
  const [userData, setUserData] = useState({
    id: '',
    Username: '',
    Email: '',
    Bio: '',
    Profile_pic: '',
    Permission_level: 0,
    credentials: '',
    Token: '',
    locale: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data by specific token
    const token = Cookies.get("Token");
    if (!token) return navigate('/login');
    
      const [decodedEmail] = CryptoJS.AES.decrypt(token, '92d7a9a5942a4a7c9b18d5046a5f8fa3b7f0bb7db5c64f2a4675d7d8a2d67f51')
        .toString(CryptoJS.enc.Utf8)
        .split(':');

      // Fetch user data by specific token
      const fetchUserData = async () => {
        try {
          const response = await fetch('http://localhost:1337/api/user-ids');
          const jsonData = await response.json();
          const data = jsonData.data || jsonData;

          // Find user by the specific token
          const user = data.find(u => u.Email === decodedEmail);
        if (user) { 
          setUserData({
            documentId: user.documentId, // Store the document ID
            Username: user.Username,
            Email: user.Email,
            Bio: user.Bio || '',
            Profile_pic: user.Profile_pic,
            Permission_level: user.Permission_level,
            credentials: user.credentials,
            Token: user.Token,
            locale: user.locale || 'en'
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Convert image to base64 with data URL prefix
        const base64Image = `data:image/png;base64,${reader.result.split(',')[1]}`;
        
        setProfileImage(file);
        setUserData(prev => ({
          ...prev,
          Profile_pic: base64Image
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare the payload exactly as specified
      const payload = {
        data: {
          Email: userData.Email,
          Permission_level: userData.Permission_level,
          credentials: userData.credentials,
          Token: userData.Token,
          Profile_pic: userData.Profile_pic,
          Bio: userData.Bio,
          Username: userData.Username,
          locale: userData.locale
        }
      };

      // Use id in the URL for specific user update
      
      const response = await fetch(`http://localhost:1337/api/user-ids/${userData.documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // Navigate back to profile page
        navigate('/profile');
      } else {
        // Handle error
        console.error('Update failed');
        const errorResponse = await response.json();
        console.error('Error details:', JSON.stringify(errorResponse));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/profile')}
          className="mr-4 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">Modifier le Profil</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <img 
              src={userData.Profile_pic} 
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            />
            <label 
              htmlFor="profile-image-upload"
              className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 cursor-pointer"
            >
              <Camera className="w-5 h-5" />
              <input 
                type="file" 
                id="profile-image-upload"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Nom d'utilisateur</label>
            <div className="flex items-center bg-gray-100 p-3 rounded-lg">
              <User className="mr-4 text-blue-500" />
              <input 
                type="text"
                name="Username"
                value={userData.Username}
                onChange={handleInputChange}
                className="w-full bg-transparent focus:outline-none"
                placeholder="Nom d'utilisateur"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">E-mail</label>
            <div className="flex items-center bg-gray-100 p-3 rounded-lg">
              <Mail className="mr-4 text-green-500" />
              <input 
                type="email"
                name="Email"
                value={userData.Email}
                onChange={handleInputChange}
                className="w-full bg-transparent focus:outline-none"
                placeholder="E-mail"
                disabled
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Bio</label>
            <textarea 
              name="Bio"
              value={userData.Bio}
              onChange={handleInputChange}
              className="w-full bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Écrivez quelque chose sur vous..."
              rows="4"
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full mt-6 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
        >
          <Save className="mr-2" /> Enregistrer les modifications
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;