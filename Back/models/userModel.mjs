import pool from "../DB_config/db.mjs";


// 🔐 Sukuria naują vartotoją
export const createUser = async (username, email, hashedPassword, role = 'user') => {
  const query = `
    INSERT INTO users (username, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, username, email, role, created_at;
  `;

  const values = [username, email, hashedPassword, role];

  const result = await pool.query(query, values);
  return result.rows[0];
};


// 🔎 Randa vartotoją pagal el. paštą
export const getUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = $1`;
  const result = await pool.query(query, [email]);
  return result.rows[0];
};


// 🔎 Randa vartotoją pagal ID
export const getUserById = async (id) => {
  const query = `SELECT * FROM users WHERE id = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};


// 🔎 Randa vartotoją pagal naudotojo vardą
export const getUserByUsername = async (username) => {
  const query = `SELECT * FROM users WHERE username = $1`;
  const result = await pool.query(query, [username]);
  return result.rows[0];
};
// 🔎 Randa visus vartotojus
export const getAllUsers = async () => {
  const query = `SELECT * FROM users ORDER BY created_at DESC`;
  const result = await pool
    .query(query);
  return result.rows; 
} 
