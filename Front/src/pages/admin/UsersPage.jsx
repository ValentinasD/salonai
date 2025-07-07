import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ username: '', email: '', role: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  // Būsenos puslapių skaidymui
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10); // Vartotojų skaičius puslapyje
  
  // Būsenos vartotojo pridėjimui
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ username: '', email: '', password: '', role: 'user' });
  
  // Būsena paieškai
  const [searchTerm, setSearchTerm] = useState('');
  
  // Būsena rūšiavimui
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get("http://localhost:3000/api/users", { 
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Klaida gaunant vartotojus:", err);
        setLoading(false);
      });
  }, []);

  // Funkcija vartotojo redagavimo pradžiai
  const handleEditUser = (user) => {
    setEditingUser(user.id);
    setEditForm({
      username: user.username,
      email: user.email,
      role: user.role
    });
  };

  // Funkcija vartotojo pakeitimų išsaugojimui
  const handleSaveUser = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:3000/api/users/${userId}`, editForm, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Atnaujiname vartotojų sąrašą
      setUsers(users.map(user => 
        user.id === userId ? { ...user, ...editForm } : user
      ));
      
      setEditingUser(null);
      alert('Vartotojas sėkmingai atnaujintas!');
    } catch (err) {
      console.error("Klaida atnaujinant vartotoją:", err);
      alert('Klaida atnaujinant vartotoją');
    }
  };

  // Funkcija redagavimo atšaukimui
  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({ username: '', email: '', role: '' });
  };

  // Funkcija ištrynimo patvirtinimui
  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Funkcija vartotojo ištrynimui
  const confirmDeleteUser = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3000/api/users/${userToDelete.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Ištrinti vartotoją iš sąrašo
      setUsers(users.filter(user => user.id !== userToDelete.id));
      
      setShowDeleteModal(false);
      setUserToDelete(null);
      alert('Vartotojas sėkmingai ištrintas!');
    } catch (err) {
      console.error("Klaida trinant vartotoją:", err);
      alert('Klaida trinant vartotoją');
    }
  };

  // Funkcija naujo vartotojo pridėjimui
  const handleAddUser = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', addForm, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Pridėti naują vartotoją į sąrašą
      setUsers([...users, response.data.user]);
      
      setShowAddModal(false);
      setAddForm({ username: '', email: '', password: '', role: 'user' });
      alert('Vartotojas sėkmingai pridėtas!');
    } catch (err) {
      console.error("Klaida pridedant vartotoją:", err);
      alert('Klaida pridedant vartotoją');
    }
  };

  // Skaičiavimai puslapių skaidymui
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  
  // Vartotojų filtravimas pagal paiešką
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Vartotojų rūšiavimas
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Skaitinių reikšmių apdorojimas
    if (sortField === 'id') {
      aValue = parseInt(aValue);
      bValue = parseInt(bValue);
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Funkcija puslapio keitimui
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Funkcija rūšiavimui
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Grįžti į pirmą puslapį rūšiuojant
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">👤 Visi vartotojai</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ➕ Pridėti vartotoją
        </button>
      </div>
      
      {/* Paieškos laukas */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Ieškoti vartotojo pagal vardą, el. paštą arba rolę..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:border-blue-500"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ❌
            </button>
          )}
        </div>
      </div>
      
      {loading ? (
        <p>Kraunama...</p>
      ) : (
        <>
          {/* Informacija apie paieškos rezultatus */}
          <div className="mb-3 text-sm text-gray-600">
            {searchTerm ? (
              <p>
                🔍 Rasta: <strong>{filteredUsers.length}</strong> vartotojas(-ai) iš <strong>{users.length}</strong>
              </p>
            ) : (
              <p>📊 Iš viso: <strong>{users.length}</strong> vartotojas(-ai)</p>
            )}
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">
                {searchTerm ? '🔍 Nerasta vartotojų pagal paieškos kriterijus' : '📭 Nėra vartotojų'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-2 text-blue-600 hover:text-blue-800 underline"
                >
                  Išvalyti paiešką
                </button>
              )}
            </div>
          ) : (
            <>
          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">El.Nr</th>
                  <th 
                    className="p-2 border cursor-pointer hover:bg-gray-300 select-none"
                    onClick={() => handleSort('id')}
                  >
                    ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="p-2 border cursor-pointer hover:bg-gray-300 select-none"
                    onClick={() => handleSort('username')}
                  >
                    Vardas {sortField === 'username' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="p-2 border cursor-pointer hover:bg-gray-300 select-none"
                    onClick={() => handleSort('email')}
                  >
                    El. paštas {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="p-2 border cursor-pointer hover:bg-gray-300 select-none"
                    onClick={() => handleSort('role')}
                  >
                    Rolė {sortField === 'role' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-2 border">Veiksmai</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="p-2 border text-center font-semibold text-gray-600">
                    {indexOfFirstUser + index + 1}
                  </td>
                  <td className="p-2 border">{user.id}</td>
                  
                  {/* Redaguojami laukai */}
                  {editingUser === user.id ? (
                    <>
                      <td className="p-2 border">
                        <input
                          type="text"
                          value={editForm.username}
                          onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                          className="w-full p-1 border rounded"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                          className="w-full p-1 border rounded"
                        />
                      </td>
                      <td className="p-2 border">
                        <select
                          value={editForm.role}
                          onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                          className="w-full p-1 border rounded"
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className="p-2 border">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSaveUser(user.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                          >
                            ✅ Išsaugoti
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700"
                          >
                            ❌ Atšaukti
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-2 border">{user.username}</td>
                      <td className="p-2 border">{user.email}</td>
                      <td className="p-2 border">
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.role === 'admin' ? 'bg-red-200 text-red-800' : 'bg-blue-200 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-2 border">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                          >
                            ✏️ Redaguoti
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                          >
                            🗑️ Ištrinti
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Puslapių skaidymas */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              ← Ankstesnis
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                className={`px-3 py-1 rounded ${
                  currentPage === pageNumber
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Kitas →
            </button>
          </div>
        )}
        </>
        )}
      </>
      )}

      {/* Modalinis langas ištrynimo patvirtinimui */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">🗑️ Patvirtinti ištrynimą</h3>
            <p className="mb-4">
              Ar tikrai norite ištrinti vartotoją <strong>{userToDelete?.username}</strong>?
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Šis veiksmas negrįžtamas!
            </p>
            <div className="flex space-x-4">
              <button
                onClick={confirmDeleteUser}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                🗑️ Taip, ištrinti
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                ❌ Atšaukti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modalinis langas vartotojo pridėjimui */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">➕ Pridėti naują vartotoją</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Vartotojo vardas:</label>
                <input
                  type="text"
                  value={addForm.username}
                  onChange={(e) => setAddForm({...addForm, username: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Įveskite vartotojo vardą"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">El. paštas:</label>
                <input
                  type="email"
                  value={addForm.email}
                  onChange={(e) => setAddForm({...addForm, email: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Įveskite el. paštą"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Slaptažodis:</label>
                <input
                  type="password"
                  value={addForm.password}
                  onChange={(e) => setAddForm({...addForm, password: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Įveskite slaptažodį"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Rolė:</label>
                <select
                  value={addForm.role}
                  onChange={(e) => setAddForm({...addForm, role: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="user">Vartotojas</option>
                  <option value="admin">Administratorius</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleAddUser}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                ✅ Pridėti
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setAddForm({ username: '', email: '', password: '', role: 'user' });
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                ❌ Atšaukti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
