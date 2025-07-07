import pool from "./db.mjs";

const userTable = `
CREATE TABLE IF NOT EXISTS users (  
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin'))
);
`;

// Funkcija, kuri sukuria vartotojų lentelę
export const createUserTable = async () => {
  try {
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'users'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      await pool.query(userTable);
      console.log("✅ Vartotojų lentelė sukurta sėkmingai.");
    } else {
      console.log("ℹ️ Vartotojų lentelė jau egzistuoja.");
    }
  } catch (error) {
    console.error("❌ Klaida kuriant vartotojų lentelę:", error);
    throw error;
  }
};
