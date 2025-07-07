import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function MyReservationsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchReservations();
  }, [user, navigate]);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/reservations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setReservations(response.data);
    } catch (error) {
      console.error('Klaida gaunant rezervacijas:', error);
      setError('Klaida gaunant rezervacijas');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm('Ar tikrai norite atšaukti šią rezervaciją?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/reservations/${reservationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // atnaujinti sarašą  reservacijų
      setReservations(reservations.filter(r => r.id !== reservationId));
      alert('Rezervacija sėkmingai atšaukta');
    } catch (error) {
      console.error('Klaida atšaukiant rezervaciją:', error);
      alert('Klaida atšaukiant rezervaciją');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Laukia patvirtinimo';
      case 'confirmed': return 'Patvirtinta';
      case 'cancelled': return 'Atšaukta';
      case 'completed': return 'Baigta';
      default: return status;
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-gray-500 mb-4">⏳ Kraunama...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-red-500 mb-4">❌ {error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Pabandyti dar kartą
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Antrašte */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="mr-4 text-gray-600 hover:text-gray-800"
              >
                ← Atgal į salonus
              </button>
              <h1 className="text-3xl font-bold text-gray-900">📅 Mano rezervacijos</h1>
            </div>
            <div className="text-sm text-gray-500">
              Sveiki, <span className="font-medium">{user.username}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Кklientas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {reservations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Nėra rezervacijų</h3>
            <p className="text-gray-500 mb-6">Jūs dar neturite rezervuoto laiko</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Rezervuoti laiką
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reservations.map((reservation) => (
              <div key={reservation.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {reservation.salon_name}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                    {getStatusText(reservation.status)}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">🏷️ Paslauga:</span>
                    {reservation.service_type}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">📅 Data:</span>
                    {new Date(reservation.reservation_date).toLocaleDateString('lt-LT')}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">⏰ Laikas:</span>
                    {reservation.reservation_time.slice(0, 5)}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">⏱️ Trukmė:</span>
                    {reservation.duration} min
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">🏢 Kategorija:</span>
                    {reservation.salon_category}
                  </div>
                </div>

                {reservation.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <span className="font-medium text-sm text-gray-700">Komentarai:</span>
                    <p className="text-sm text-gray-600 mt-1">{reservation.notes}</p>
                  </div>
                )}

                <div className="mt-6 flex justify-between items-center text-xs text-gray-500">
                  <span>Sukurta: {new Date(reservation.created_at).toLocaleDateString('lt-LT')}</span>
                  {reservation.status === 'pending' && (
                    <button
                      onClick={() => handleCancelReservation(reservation.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Atšaukti
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
