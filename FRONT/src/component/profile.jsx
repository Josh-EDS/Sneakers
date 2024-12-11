import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Shield, 
  Edit, 
  Camera, 
  LogOut 
} from 'lucide-react';
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [redirectToAdmin, setRedirectToAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("Token");
    if (!token) return navigate('/login');
    
      const [decodedEmail] = CryptoJS.AES.decrypt(token, '92d7a9a5942a4a7c9b18d5046a5f8fa3b7f0bb7db5c64f2a4675d7d8a2d67f51')
        .toString(CryptoJS.enc.Utf8)
        .split(':');
      const fetchUserData = async () => {
        try {
          const response = await fetch('http://localhost:1337/api/user-ids');
          const jsonData = await response.json();
          const data = jsonData.data || jsonData;
          const user = data.find(u => u.Email === decodedEmail);

          if (user) {
            setUserData(user);
            if (user.Permission_level > 0) {
              setShowPopup(true);
            }
          } else {
            navigate('/login');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          navigate('/login');
        }
      };
    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    document.cookie.split(";").forEach(c => document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/");
    navigate('/login');
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handleRedirectToAdmin = () => {
    setRedirectToAdmin(true);
    setShowPopup(false);
  };

  useEffect(() => {
    if (redirectToAdmin) {
      navigate('/admin');
    }
  }, [redirectToAdmin, navigate]);

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Chargement...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="bg-white shadow-xl rounded-2xl p-6 relative">
        <button 
          onClick={handleLogout}
          className="absolute top-4 right-4 text-red-500 hover:text-red-700 flex items-center"
        >
          <LogOut className="mr-2" /> Déconnexion
        </button>

        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <img 
              src={userData.Profile_pic} 
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            />
            <button 
              onClick={handleEditProfile}
              className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <h2 className="text-2xl font-bold">{userData.Username}</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center bg-gray-100 p-3 rounded-lg">
            <User className="mr-4 text-blue-500" />
            <div>
              <p className="text-gray-600 text-sm">Nom d'utilisateur</p>
              <p className="font-semibold">{userData.Username}</p>
            </div>
          </div>

          <div className="flex items-center bg-gray-100 p-3 rounded-lg">
            <Mail className="mr-4 text-green-500" />
            <div>
              <p className="text-gray-600 text-sm">E-mail</p>
              <p className="font-semibold">{userData.Email}</p>
            </div>
          </div>

          <div className="flex items-center bg-gray-100 p-3 rounded-lg">
            <Shield className="mr-4 text-purple-500" />
            <div>
              <p className="text-gray-600 text-sm">Niveau de Permission</p>
              <p className="font-semibold">
                {userData.Permission_level === 0 
                  ? 'Utilisateur Standard' 
                  : userData.Permission_level === 1 
                  ? 'Modérateur' 
                  : userData.Permission_level === 2 
                  ? 'Administrateur'
                  : 'SuperAdmin'  }
              </p>
            </div>
          </div>

          <div className="bg-gray-100 p-3 rounded-lg">
            <p className="text-gray-600 text-sm mb-2">Bio</p>
            <p className="font-semibold">{userData.Bio || 'Aucune bio disponible'}</p>
          </div>
        </div>

        <button 
          onClick={handleEditProfile}
          className="w-full mt-6 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
        >
          <Edit className="mr-2" /> Modifier le Profil
        </button>
      </div>

      <div className="mt-6 text-center text-gray-500">
        <p>Compte créé le {new Date(userData.createdAt).toLocaleDateString()}</p>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold">Voulez-vous être redirigé vers la page admin ?</h2>
            <div className="mt-4">
              <button
                onClick={handleRedirectToAdmin}
                className="mr-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
              >
                Oui
              </button>
              <button
                onClick={handlePopupClose}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
              >
                Non
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
