import express from 'express';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.mjs';
import { getAllUsers, getUser, updateUser, deleteUser, searchUserByEmail } from '../controllers/userController.mjs';

const router = express.Router();

// Vartotojų maršrutai
router.get('/search', authenticateToken, searchUserByEmail); // Paieška pagal el. paštą (prieš /:id)
router.get('/test/admin-only', authenticateToken, authorizeAdmin, (req, res) => {
  res.json({ message: '🎉 Jūs prisijungę kaip administratorius!' });
});
router.get('/test/user-info', authenticateToken, (req, res) => {
  res.json({ message: '🎉 Jūs prisijungę kaip vartotojas!', user: req.user });
});
router.get('/', authenticateToken, authorizeAdmin, getAllUsers); // Gauti visus vartotojus (tik adminui)
router.get('/:id', authenticateToken, getUser); // Gauti vartotoją pagal ID
router.put('/:id', authenticateToken, authorizeAdmin, updateUser); // Atnaujinti vartotojo duomenis (tik adminui)
router.delete('/:id', authenticateToken, authorizeAdmin, deleteUser); // Ištrinti vartotoją (tik adminui)

export default router;
