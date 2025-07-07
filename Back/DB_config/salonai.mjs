import pool from "./db.mjs";

const salonTable = `
CREATE TABLE IF NOT EXISTS salon (
  id SERIAL PRIMARY KEY,
  salon VARCHAR(100) NOT NULL,                       -- salono pavadinimas
  category TEXT NOT NULL,                            -- kategorija
  inversion VARCHAR(100) NOT NULL,                   -- reitingas (1-5)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP    -- sukūrimo laikas
);
`;

// Funkcija, kuri sukuria salonųų lentelę
export const createSalonTable = async () => {
  try {
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'salon'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      await pool.query(salonTable);
      console.log("✅ Salonų lentelė sukurta sėkmingai.");
    } else {
      console.log("ℹ️  Salonų lentelė jau egzistuoja.");
    }
  } catch (error) {
    console.error("❌ Klaida kuriant salonų lentelę:", error);
    throw error;
  }
};
