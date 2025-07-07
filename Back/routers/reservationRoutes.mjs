import express from 'express';
import { 
  getUserReservations,
  getAllReservations,
  createReservation,
  updateReservation,
  deleteReservation,
  getAvailableSlots
} from '../controllers/reservationController.mjs';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.mjs';

const router = express.Router();

// 📥 GET /api/reservations - gauti rezervacija vartotojo 
router.get('/', authenticateToken, getUserReservations);

// 📥 GET /api/reservations/all - gauti visas rezervacijas tik admin
router.get('/all', authenticateToken, requireAdmin, getAllReservations);

// 📥 GET /api/reservations/available-slots - gauti laisvus laikus
router.get('/available-slots', getAvailableSlots);

// 📝 POST /api/reservations - sukurti nauja rezervacija 
router.post('/', authenticateToken, createReservation);

// ✏️ PUT /api/reservations/:id - atnaujinti rezervacija 
router.put('/:id', authenticateToken, updateReservation);

// 🗑️ DELETE /api/reservations/:id - pa6alinti rezervacija 
router.delete('/:id', authenticateToken, deleteReservation);

export default router;
