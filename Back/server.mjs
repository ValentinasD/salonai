import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './DB_config/db.mjs';
import { createUserTable } from './DB_config/user_table.mjs';
import { createSalonTable } from './DB_config/salonai.mjs';

import authRoutes from './routers/authRoutes.mjs';
import userRouter from './routers/userRoutes.mjs';
import salonRouter from './routers/salonRoutes.mjs';

dotenv.config();

const app = express();

// ✅ CORS nustatymai
// Leisti tik localhost:5173 prieigą prie API
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRouter);
app.use('/api/salons', salonRouter);

// 🚀 Start SERVER
const startServer = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ PostgreSQL prisijungta sėkmingai:', result.rows[0].now);

    await createUserTable();
    await createSalonTable();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Serveris veikia portu ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Nepavyko prisijungti prie duomenų bazės:', error.message);
    process.exit(1);
  }
};

startServer();
