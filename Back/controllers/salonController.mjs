import pool from '../DB_config/db.mjs';
import {  getUserByCategory } from '../models/salonModel.mjs';

// 🔍 Gauti saloną pagal ID (helper funkcija)
const getSalonById = async (id) => {
  const result = await pool.query(
    'SELECT id, salon, category, inversion, created_at FROM salon WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

// 📥 Gauti visus salonus (galima filtruoti pagal kategorija)
export const getAllSalons = async (req, res) => {
  const { category } = req.query;

  try {
    let result;

    if (category) {
      result = await pool.query(
        'SELECT id, salon, category, inversion, created_at FROM salon WHERE category = $1 ORDER BY created_at DESC',
        [category]
      );
    } else {
      result = await pool.query(
        'SELECT id, salon, category, inversion, created_at FROM salon ORDER BY created_at DESC'
      );
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Klaida gaunant salonus:', err);
    res.status(500).json({ message: 'Serverio klaida.' });
  }
};

// 📥 Gauti saloną pagal ID
export const getSalon = async (req, res) => {
  const { id } = req.params;

  try {
    const salon = await getSalonById(id);
    
    if (!salon) {
      return res.status(404).json({ message: 'Salonas nerastas.' });
    }

    res.status(200).json(salon);
  } catch (err) {
    console.error('❌ Klaida gaunant saloną:', err);
    res.status(500).json({ message: 'Serverio klaida.' });
  }
};

// 📝 Sukurti naują saloną
export const createSalon = async (req, res) => {
  const { salon, category, inversion } = req.body;

  // Validacija
  if (!salon || !category) {
    return res.status(400).json({ 
      message: 'Salono pavadinimas ir kategorija yra privalomi.' 
    });
  }

  // Validacija reitingui
  if (inversion !== undefined && (inversion < 1 || inversion > 5)) {
    return res.status(400).json({ 
      message: 'Reitingas turi būti nuo 1 iki 5.' 
    });
  }

  try {
    const result = await pool.query(
      'INSERT INTO salon (salon, category, inversion) VALUES ($1, $2, $3) RETURNING *',
      [salon, category, inversion || 1]
    );

    res.status(201).json({
      message: 'Salonas sėkmingai sukurtas.',
      salon: result.rows[0]
    });
  } catch (err) {
    console.error('❌ Klaida kuriant saloną:', err);
    
    if (err.code === '23505') { // Unique constraint violation
      return res.status(409).json({ 
        message: 'Salonas su tokiu pavadinimu jau egzistuoja.' 
      });
    }
    
    res.status(500).json({ message: 'Serverio klaida.' });
  }
};

// ✏️ Atnaujinti saloną
export const updateSalon = async (req, res) => {
  const { id } = req.params;
  const { salon, category, inversion } = req.body;

  // Validacija reitingui
  if (inversion !== undefined && (inversion < 1 || inversion > 5)) {
    return res.status(400).json({ 
      message: 'Reitingas turi būti nuo 1 iki 5.' 
    });
  }

  try {
    // Patikrinti ar salonas egzistuoja
    const existingSalon = await getSalonById(id);
    if (!existingSalon) {
      return res.status(404).json({ message: 'Salonas nerastas.' });
    }

    const result = await pool.query(
      `UPDATE salon 
       SET salon = COALESCE($1, salon), 
           category = COALESCE($2, category), 
           inversion = COALESCE($3, inversion),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 
       RETURNING *`,
      [salon, category, inversion, id]
    );

    res.status(200).json({
      message: 'Salonas sėkmingai atnaujintas.',
      salon: result.rows[0]
    });
  } catch (err) {
    console.error('❌ Klaida atnaujinant saloną:', err);
    
    if (err.code === '23505') { // Unique constraint violation
      return res.status(409).json({ 
        message: 'Salonas su tokiu pavadinimu jau egzistuoja.' 
      });
    }
    
    res.status(500).json({ message: 'Serverio klaida.' });
  }
};

// 🗑️ Ištrinti saloną
export const deleteSalon = async (req, res) => {
  const { id } = req.params;
  
  console.log('🗑️ Attempting to delete salon with ID:', id);

  try {
    // Patikrinti ar salonas egzistuoja
    const existingSalon = await getSalonById(id);
    console.log('Found salon:', existingSalon);
    
    if (!existingSalon) {
      console.log('❌ Salon not found with ID:', id);
      return res.status(404).json({ message: 'Salonas nerastas.' });
    }

    await pool.query('DELETE FROM salon WHERE id = $1', [id]);
    console.log('✅ Salon deleted successfully');

    res.status(200).json({ 
      message: 'Salonas sėkmingai ištrintas.' 
    });
  } catch (err) {
    console.error('❌ Klaida trinant saloną:', err);
    res.status(500).json({ message: 'Serverio klaida.' });
  }
};

// � Gauti salonų statistiką
export const getSalonStats = async (req, res) => {
  try {
    const totalResult = await pool.query('SELECT COUNT(*) as total FROM salon');
    const categoryResult = await pool.query(
      'SELECT category, COUNT(*) as count FROM salon GROUP BY category ORDER BY count DESC'
    );

    const stats = {
      total: parseInt(totalResult.rows[0].total),
      byCategory: categoryResult.rows
    };

    res.status(200).json(stats);
  } catch (err) {
    console.error('❌ Klaida gaunant statistiką:', err);
    res.status(500).json({ message: 'Serverio klaida.' });
  }
};