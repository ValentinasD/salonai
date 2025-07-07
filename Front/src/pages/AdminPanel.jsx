import React from 'react';
import { Outlet, NavLink, useNavigate  } from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/api/auth/logout", {}, {
        withCredentials: true,
      });
      logout(); // ištrinti user iš context
      navigate("/"); // grįžti į home page
    } catch (err) {
      console.error("Atsijungimo klaida:", err);
      
      logout();
      navigate("/"); 
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      {/* 🔵 Šoninė navigacija */}
      <aside className="w-64 bg-gray-800 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-6">Admin Panelė</h2>
          <p className="text-sm text-yellow-300 mb-4">Prisijungęs: <b>{user?.username}</b></p>
          <nav className="space-y-3">
            <NavLink 
              to="/admin/users" 
              className={({ isActive }) => 
                `block hover:text-yellow-300 ${isActive ? 'text-yellow-300 font-bold' : ''}`
              }
            >
              👤 Vartotojai
            </NavLink>
            <NavLink 
              to="/admin/salons" 
              className={({ isActive }) => 
                `block hover:text-yellow-300 ${isActive ? 'text-yellow-300 font-bold' : ''}`
              }
            >
              🏢 Salonai
            </NavLink>
          </nav>
        </div>

        {/* 🔴 Atsijungimo mygtukas */}
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
        >
          Atsijungti
        </button>
      </aside>

      {/* 🔸 Turinio sritis */}
      <main className="flex-1 bg-gray-100 text-black p-4 overflow-auto">
        <div className="max-w-screen-xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
