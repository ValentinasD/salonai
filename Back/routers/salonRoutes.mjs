import express from 'express';
import { 
  getAllSalons, 
  getSalon, 
  createSalon, 
  updateSalon, 
  deleteSalon,
  getSalonStats
} from '../controllers/salonController.mjs';
import { authenticateToken } from '../middleware/authMiddleware.mjs';

const router = express.Router();

// 📥 GET /api/salons - Gauti visus salonus (galima filtruoti pagal kategorija)
router.get('/', getAllSalons);

// 📥 GET /api/salons/stats - Gauti salonų statistiką
router.get('/stats', getSalonStats);

// 📥 GET /api/salons/:id - Gauti konkretų saloną
router.get('/:id', getSalon);

// 📝 POST /api/salons - Sukurti naują saloną (tik adminui)
router.post('/', authenticateToken, createSalon);

// ✏️ PUT /api/salons/:id - Atnaujinti saloną (tik adminui)
router.put('/:id', authenticateToken,  updateSalon);

// 🗑️ DELETE /api/salons/:id - Ištrinti saloną (tik adminui)
router.delete('/:id', authenticateToken, deleteSalon);

export default router;
