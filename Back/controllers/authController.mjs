// controllers/authController.mjs
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { createUser, getUserByEmail } from '../models/userModel.mjs';

dotenv.config();

// 🔐 Registracija vartotojo
export const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Ar toks email jau yra?
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: '❌ El. paštas jau naudojamas.' });
    }

    // Slaptažodžio hash'inimas
    const hashedPassword = await bcrypt.hash(password, 10);

    // Vartotojo sukūrimas role yra 'user' jei nenurodyta
    const userRole = role || 'user';
    const newUser = await createUser(username, email, hashedPassword, userRole);

    res.status(201).json({
      message: '✅ Vartotojas sukurtas sėkmingai.',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        created_at: newUser.created_at,
      },
    });
  } catch (error) {
    console.error('❌ Klaida registruojant vartotoją:', error);
    res.status(500).json({ message: 'Serverio klaida.' });
  }
};

// 🔐 Prisijungimas (login)
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: '❌ El. paštas arba slaptažodis neteisingi.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '❌ El. paštas arba slaptažodis neteisingi.' });
    }

    // JWT kūrimas
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: '✅ Prisijungimas sėkmingas.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('❌ Klaida prisijungiant:', error);
    res.status(500).json({ message: 'Serverio klaida.' });
  }
};

// 🔐 Išsiregistravimas (logout)
export const logoutUser = (req, res) => {
  // Išsiregistravimas tiesiog reiškia, kad klientas turi pašalinti JWT iš savo saugyklos
  res.status(200).json({ message: '✅ Išsiregistravimas sėkmingas.' });
};