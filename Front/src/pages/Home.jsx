import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function HomePageComponent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">

      {/* ✅ Vartotojo info – dešinėje */}
      {user && (
        <div className="fixed top-4 right-4 z-50 flex items-center space-x-4">
          <span className="bg-yellow-400 text-black px-3 py-2 rounded-md font-semibold shadow-lg">
            Sveiki, <b>{user.username}</b>
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors shadow-lg font-medium"
          >
            Atsijungti
          </button>
        </div>
      )}

      {/* ✅ Prisijungimo/registracijos mygtukai – dešinėje */}
      {!user && (
        <div className="fixed top-4 right-4 z-50 flex items-center space-x-4">
          <NavLink
            to="/register"
            className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-lg font-medium"
          >
            👤 Registruotis
          </NavLink>
          <NavLink
            to="/login"
            className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors shadow-lg font-medium"
          >
            🔒 Prisijungti
          </NavLink>
        </div>
      )}

      {/* 📄 Turinys */}
      <main className="flex flex-col items-center justify-center h-screen p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">🏠 HOME PAGE</h1>
        <p className="text-xl text-gray-700">Čia galėtų būti jūsų pagrindinis puslapis 😊</p>
      </main>
    </div>
  );
}

export default HomePageComponent;
