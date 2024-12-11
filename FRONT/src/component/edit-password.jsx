import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  KeyRound, 
  ArrowLeft,
} from 'lucide-react';
import * as CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';

const PasswordChangePage = () => {
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("Token");
    if (!token) return navigate('/login');
    
    const [decodedEmail] = CryptoJS.AES.decrypt(token, '92d7a9a5942a4a7c9b18d5046a5f8fa3b7f0bb7db5c64f2a4675d7d8a2d67f51')
      .toString(CryptoJS.enc.Utf8)
      .split(':');
    
    setEmail(decodedEmail);
  }, [navigate]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !currentPassword || !newPassword || !confirmPassword) {
      setError('Tous les champs sont obligatoires');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    try {
      const userResponse = await fetch(`http://localhost:1337/api/user-ids?filters[Email]=${email}`);
      const userData = await userResponse.json();

      if (userData.data.length === 0) {
        setError('Aucun utilisateur trouvé avec cet email');
        return;
      }

      const user = userData.data[0];
      const hashedCurrentPassword = CryptoJS.SHA256(currentPassword).toString();
      
      if (hashedCurrentPassword !== user.credentials) {
        setError('Mot de passe actuel incorrect');
        return;
      }

      const hashedNewPassword = CryptoJS.SHA256(newPassword).toString();

      const updateResponse = await fetch(`http://localhost:1337/api/user-ids/${user.documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            credentials: hashedNewPassword
          }
        })
      });

      if (!updateResponse.ok) {
        throw new Error('Erreur lors de la mise à jour du mot de passe');
      }

      setSuccess('Mot de passe modifié avec succès');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
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
        <h1 className="text-2xl font-bold">Changer de Mot de Passe</h1>
      </div>

      <form onSubmit={handlePasswordChange} className="bg-white shadow-xl rounded-2xl p-6">
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">E-mail</label>
            <div className="flex items-center bg-gray-100 p-3 rounded-lg">
              <Mail className="mr-4 text-green-500" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent focus:outline-none"
                placeholder="E-mail"
                disabled
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Mot de Passe Actuel</label>
            <div className="flex items-center bg-gray-100 p-3 rounded-lg">
              <Lock className="mr-4 text-blue-500" />
              <input 
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-transparent focus:outline-none"
                placeholder="Mot de passe actuel"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Nouveau Mot de Passe</label>
            <div className="flex items-center bg-gray-100 p-3 rounded-lg">
              <Lock className="mr-4 text-purple-500" />
              <input 
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-transparent focus:outline-none"
                placeholder="Nouveau mot de passe"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Confirmer le Nouveau Mot de Passe</label>
            <div className="flex items-center bg-gray-100 p-3 rounded-lg">
              <Lock className="mr-4 text-purple-500" />
              <input 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent focus:outline-none"
                placeholder="Confirmer le nouveau mot de passe"
                required
              />
            </div>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full mt-6 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition flex items-center justify-center"
        >
          <KeyRound className="mr-2" /> Enregistrer le nouveau mot de passe
        </button>
      </form>
    </div>
  );
};

export default PasswordChangePage;