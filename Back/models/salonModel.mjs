import pool from "../DB_config/db.mjs";

// 🔐 Sukuria naują saloną
export const createSalon = async (name, address, phone, email) => {
  const query = `
    INSERT INTO salons (salon, category, inversion, )
    VALUES ($1, $2, $3, )
    RETURNING id, salon, category, inversion, created_at;
  `;

  const values = [salon, category, inversion, created_at];

  const result = await pool.query(query, values);
  return result.rows[0];
};


// 🔎 Randa saloną pagal kategorija
export const getUserByCategory = async (category) => {
  const query = `SELECT * FROM salon WHERE category = $1`;
  const result = await pool.query(query, [category]);
  return result.rows[0];
};


// 🔎 Randa salonaą pagal pavadinima
export const getSalnBySalon = async (salon) => {
  const query = `SELECT * FROM salon WHERE salon = $1`;
  const result = await pool.query(query, [salon]);
  return result.rows[0];
};

// 🔎 Randa visus salonus
export const getAllSalons = async () => {
  const query = `SELECT * FROM salon ORDER BY created_at DESC`;
  const result = await pool
    .query(query);
  return result.rows; 
} 
