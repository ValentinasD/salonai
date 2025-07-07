import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SalonPage() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSalon, setEditingSalon] = useState(null);
  const [editForm, setEditForm] = useState({
    salon: "",
    category: "",
    inversion: 0,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSalonId, setDeleteSalonId] = useState(null);

  // Būsenos puslapių skaidymui
  const [currentPage, setCurrentPage] = useState(1);
  const [salonsPerPage] = useState(10); // Salonų skaičius puslapyje

  // Būsena salono kūrimui
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    salon: "",
    category: "",
    inversion: 1,
  });

  // Būsena paieškai
  const [searchTerm, setSearchTerm] = useState('');

  // Būsena rūšiavimui
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get("http://localhost:3000/api/salons", { 
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then((res) => {
        setSalons(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Klaida gaunant salonus:", err);
        setError("Nepavyko gauti salonų");
        setLoading(false);
      });
  }, []);

  // Функции для работы с салонами
  const handleEditSalon = (salon) => {
    setEditingSalon(salon.id);
    setEditForm({
      salon: salon.salon,
      category: salon.category,
      inversion: salon.inversion || 1,
    });
  };

  const handleSaveSalon = async (salonId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        `http://localhost:3000/api/salons/${salonId}`, 
        editForm, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setSalons(salons.map(salon => 
        salon.id === salonId ? response.data.salon : salon
      ));
      
      setEditingSalon(null);
      alert('Salonas sėkmingai atnaujintas!');
    } catch (err) {
      console.error("Klaida atnaujinant saloną:", err);
      alert('Klaida atnaujinant saloną');
    }
  };

  const handleCancelEdit = () => {
    setEditingSalon(null);
    setEditForm({ salon: '', category: '', inversion: 1 });
  };

  const handleDeleteSalon = (salon) => {
    setDeleteSalonId(salon);
    setShowDeleteModal(true);
  };

  const confirmDeleteSalon = async () => {
    const token = localStorage.getItem('token');
    console.log('Token:', token ? 'exists' : 'missing');
    console.log('Deleting salon ID:', deleteSalonId.id);
    
    try {
      await axios.delete(`http://localhost:3000/api/salons/${deleteSalonId.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setSalons(salons.filter(salon => salon.id !== deleteSalonId.id));
      
      setShowDeleteModal(false);
      setDeleteSalonId(null);
      alert('Salonas sėkmingai ištrintas!');
    } catch (err) {
      console.error("Klaida trinant saloną:", err);
      const errorMessage = err.response?.data?.message || err.message || 'Nežinoma klaida';
      alert(`Klaida trinant saloną: ${errorMessage}`);
    }
  };

  const handleAddSalon = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:3000/api/salons', addForm, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setSalons([response.data.salon, ...salons]);
      
      setShowAddModal(false);
      setAddForm({ salon: '', category: '', inversion: 1 });
      alert('Salonas sėkmingai pridėtas!');
    } catch (err) {
      console.error("Klaida pridedant saloną:", err);
      alert('Klaida pridedant saloną');
    }
  };

  if (loading) return <div className="text-center py-8">Kraunama...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  // paginacia skaciokle
  const indexOfLastSalon = currentPage * salonsPerPage;
  const indexOfFirstSalon = indexOfLastSalon - salonsPerPage;
  
  const filteredSalons = salons.filter(salon =>
    salon.salon.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salon.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedSalons = [...filteredSalons].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === 'id' || sortField === 'inversion') {
      aValue = parseInt(aValue) || 0;
      bValue = parseInt(bValue) || 0;
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  const currentSalons = sortedSalons.slice(indexOfFirstSalon, indexOfLastSalon);
  const totalPages = Math.ceil(filteredSalons.length / salonsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">🏢 Visi salonai</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ➕ Pridėti saloną
        </button>
      </div>
      
      {/* Paieškos laukas */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Ieškoti salono pagal pavadinimą arba kategoriją..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:border-blue-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Statistikos kortelė */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-800">📊 Statistika</h3>
            <p className="text-blue-600">Rasta salonų: {filteredSalons.length}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-600">Rodoma: {currentSalons.length}</p>
            <p className="text-sm text-blue-600">Iš viso: {salons.length}</p>
          </div>
        </div>
      </div>

      {/* Salonų lentelė */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('id')}
              >
                ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('salon')}
              >
                Salonas {sortField === 'salon' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('category')}
              >
                Kategorija {sortField === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('inversion')}
              >
                Reitingas {sortField === 'inversion' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sukurta
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Veiksmai
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentSalons.map((salon) => (
              <tr key={salon.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {salon.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingSalon === salon.id ? (
                    <input
                      type="text"
                      value={editForm.salon}
                      onChange={(e) => setEditForm({...editForm, salon: e.target.value})}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                  ) : (
                    <div className="text-sm font-medium text-gray-900">{salon.salon}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingSalon === salon.id ? (
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value="">Pasirinkite kategoriją</option>
                      <option value="Grožio salonas">Grožio salonas</option>
                      <option value="Kirpykla">Kirpykla</option>
                      <option value="SPA">SPA</option>
                      <option value="Nagų studija">Nagų studija</option>
                      <option value="Masažo studija">Masažo studija</option>
                    </select>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {salon.category}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingSalon === salon.id ? (
                    <input
                      type="number"
                      value={editForm.inversion}
                      onChange={(e) => setEditForm({...editForm, inversion: parseFloat(e.target.value) || 0})}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      min="1"
                      max="5"
                      step="0.1"
                    />
                  ) : (
                    <div className="text-sm text-gray-900">{salon.inversion || 0}/5</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(salon.created_at).toLocaleDateString('lt-LT')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingSalon === salon.id ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSaveSalon(salon.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        ✅ Išsaugoti
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        ❌ Atšaukti
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditSalon(salon)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        ✏️ Redaguoti
                      </button>
                      <button
                        onClick={() => handleDeleteSalon(salon)}
                        className="text-red-600 hover:text-red-900"
                      >
                        🗑️ Ištrinti
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Puslapių navigacija */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="flex space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded ${
                currentPage === 1 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              ⬅️ Atgal
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`px-3 py-2 rounded ${
                  currentPage === index + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded ${
                currentPage === totalPages 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Pirmyn ➡️
            </button>
          </nav>
        </div>
      )}

      {/* Modal pridėjimui */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">➕ Pridėti naują saloną</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salono pavadinimas *
                  </label>
                  <input
                    type="text"
                    value={addForm.salon}
                    onChange={(e) => setAddForm({...addForm, salon: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="Įveskite salono pavadinimą"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategorija *
                  </label>
                  <select
                    value={addForm.category}
                    onChange={(e) => setAddForm({...addForm, category: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Pasirinkite kategoriją</option>
                    <option value="Grožio salonas">Grožio salonas</option>
                    <option value="Kirpykla">Kirpykla</option>
                    <option value="SPA">SPA</option>
                    <option value="Nagų studija">Nagų studija</option>
                    <option value="Masažo studija">Masažo studija</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reitingas (1-5)
                  </label>
                  <input
                    type="number"
                    value={addForm.inversion}
                    onChange={(e) => setAddForm({...addForm, inversion: parseFloat(e.target.value) || 0})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="1.0"
                    min="1"
                    max="5"
                    step="0.1"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Atšaukti
                </button>
                <button
                  onClick={handleAddSalon}
                  disabled={!addForm.salon || !addForm.category}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Pridėti saloną
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal ištrynimui */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">🗑️ Patvirtinti ištrynimą</h3>
              <p className="text-sm text-gray-500 mb-6">
                Ar tikrai norite ištrinti saloną "{deleteSalonId?.salon}"?
                <br />
                <span className="text-red-500 font-medium">Šis veiksmas negrįžtamas!</span>
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Atšaukti
                </button>
                <button
                  onClick={confirmDeleteSalon}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Ištrinti
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}