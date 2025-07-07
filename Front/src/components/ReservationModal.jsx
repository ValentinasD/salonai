import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function ReservationModal({ salon, isOpen, onClose }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    service_type: '',
    reservation_date: '',
    reservation_time: '',
    duration: 60,
    notes: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const services = [
    'Kirpimas',
    'Šukuosena',
    'Dažymas',
    'Manikūras',
    'Pedikūras',
    'Masažas',
    'Kosmetinės procedūros',
    'SPA procedūros'
  ];

  // Kreipiam laisvus laikus iš API
  const fetchAvailableSlots = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/reservations/available-slots`, {
        params: {
          salon_id: salon.id,
          date: formData.reservation_date
        }
      });
      setAvailableSlots(response.data.availableSlots);
    } catch (error) {
      console.error('Klaida gaunant laisvus laikus:', error);
      setAvailableSlots([]);
    }
  }, [salon?.id, formData.reservation_date]);

  useEffect(() => {
    if (formData.reservation_date && salon?.id) {
      fetchAvailableSlots();
    }
  }, [formData.reservation_date, salon?.id, fetchAvailableSlots]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Norint rezervuoti reikia prisijungti prie sistemos');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/api/reservations', {
        salon_id: salon.id,
        ...formData
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      alert('Rezervacija sėkmingai sukurta!');
      onClose();
      // formData išvalymas
      setFormData({
        service_type: '',
        reservation_date: '',
        reservation_time: '',
        duration: 60,
        notes: ''
      });
    } catch (error) {
      console.error('Klaida kuriant rezervaciją:', error);
      const errorMessage = error.response?.data?.message || 'Klaida kuriant rezervaciją';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // gauti šiandienos datą formatu YYYY-MM-DD
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            📅 Rezervuoti laiką salone "{salon?.salon}"
          </h3>
          
          {!user && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              Rezervavimui reikia prisijungti prie sistemos
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paslauga *
              </label>
              <select
                name="service_type"
                value={formData.service_type}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="">Pasirinkite paslaugą</option>
                {services.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data *
              </label>
              <input
                type="date"
                name="reservation_date"
                value={formData.reservation_date}
                onChange={handleChange}
                min={getMinDate()}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Laikas *
              </label>
              <select
                name="reservation_time"
                value={formData.reservation_time}
                onChange={handleChange}
                required
                disabled={!formData.reservation_date}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="">Pasirinkite laiką</option>
                {availableSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
              {formData.reservation_date && availableSlots.length === 0 && (
                <p className="text-sm text-red-500 mt-1">Šiai datai nėra laisvų laikų</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trukmė (minutės)
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value={30}>30 minučių</option>
                <option value={60}>1 valanda</option>
                <option value={90}>1.5 valandos</option>
                <option value={120}>2 valandos</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Papildomi komentarai
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Papildomi pageidavimai..."
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Atšaukti
              </button>
              <button
                type="submit"
                disabled={loading || !user}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Rezervuojama...' : 'Rezervuoti'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
