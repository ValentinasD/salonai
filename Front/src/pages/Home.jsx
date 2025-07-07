import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// importojam nuotraukas
import salon1 from '../image/salon1.jpeg';
import salon2 from '../image/salon2.jpeg';
import salon3 from '../image/salon3.jpeg';
import salon4 from '../image/salon4.jpeg';
import salon5 from '../image/salon5.jpeg';
import spa1 from '../image/spa1.jpeg';
import spa2 from '../image/spa2.jpeg';
import spa3 from '../image/spa3.jpeg';

function HomePageComponent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // funkcija, kuri grąžina atitinkamą nuotrauką pagal saloną
  // Jei salonas yra SPA, grąžina SPA nuotrauką, kitu atveju grąžina bendrą nuotrauką
  const getSalonImage = (salon) => {
    const images = [salon1, salon2, salon3, salon4, salon5, spa1, spa2, spa3];
    
    // esant SPA kategorijos, grąžiname atitinkamą SPA nuotrauką
    if (salon.category.toLowerCase().includes('spa')) {
      const spaImages = [spa1, spa2, spa3];
      return spaImages[salon.id % spaImages.length];
    }
    
    //  jei salonas nėra SPA, grąžiname bendrą nuotrauką
    return images[salon.id % images.length];
  };

  useEffect(() => {
    // krauname salonus iš API
    axios
      .get("http://localhost:3000/api/salons")
      .then((res) => {
        setSalons(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Klaida gaunant salonus:", err);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredSalons = salons.filter(salon =>
    salon.salon.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salon.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 relative">

      {/* ✅ Vartotojo info – dešinėje */}
      {user && (
        <div className="fixed top-4 right-4 z-50 flex items-center space-x-4">
          {user.role === 'admin' && (
            <NavLink
              to="/admin"
              className="bg-purple-600 text-white px-3 py-2 rounded-md hover:bg-purple-700 transition-colors shadow-lg font-medium"
            >
              ⚙️ Admin
            </NavLink>
          )}
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
      <main className="pt-20 px-6 pb-10 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">🏢 Grožio salonų katalogas</h1>
            <p className="text-xl text-gray-600 mb-8">Atraskite geriausius grožio salonus savo mieste</p>
            
            {/* Paieškos laukas */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="🔍 Ieškoti salono pagal pavadinimą arba kategoriją..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:border-blue-500 shadow-sm"
                />
                <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-2xl text-gray-500">⏳ Kraunama...</div>
            </div>
          ) : (
            <>
              {/* Statistika */}
              <div className="text-center mb-8">
                <p className="text-gray-600">
                  Rasta <span className="font-semibold text-blue-600">{filteredSalons.length}</span> salonų iš <span className="font-semibold">{salons.length}</span>
                </p>
              </div>

              {/* Salonų tinklelis */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSalons.map((salon) => (
                  <div key={salon.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200">
                    {/* Изображение салона */}
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img 
                        src={getSalonImage(salon)} 
                        alt={`${salon.salon} фото`} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-800 truncate">
                          {salon.salon}
                        </h3>
                        <div className="flex items-center space-x-1 bg-yellow-100 px-2 py-1 rounded-full">
                          <span className="text-yellow-600">⭐</span>
                          <span className="text-sm font-medium text-yellow-700">
                            {salon.inversion || 1}/5
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                          {salon.category}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-500 mb-4">
                        📅 Sukurta: {new Date(salon.created_at).toLocaleDateString('lt-LT')}
                      </div>
                      
                      <div className="border-t pt-3">
                        <div className="flex items-center justify-between">
                          <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                            Daugiau info
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredSalons.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">😔</div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Salonų nerasta</h3>
                  <p className="text-gray-500">Pabandykite keisti paieškos parametrus</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default HomePageComponent;
