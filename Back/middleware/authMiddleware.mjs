import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// 🔐 Middleware: Tikrina ar JWT galioja
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Tikimės formato: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: '❌ Nepateiktas prieigos raktas (token).' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, iat, exp }
    next();
  } catch (error) {
    return res.status(403).json({ message: '❌ Neteisingas arba pasibaigęs prieigos raktas.' });
  }
};

// 🔐 Tik adminams skirta apsauga
export const authorizeAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: '🚫 Prieiga tik administratoriams.' });
  }
  next();
};
