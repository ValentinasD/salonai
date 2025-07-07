import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/authController.mjs';
import { validateRegister, validateLogin } from '../validators/authValidator.mjs';

const router = express.Router();

// ✅ Registracija
router.post('/register', validateRegister, registerUser);

// ✅ Prisijungimas
router.post('/login', validateLogin, loginUser);

// ✅ Atsijungimas
router.post('/logout', logoutUser);

export default router;

