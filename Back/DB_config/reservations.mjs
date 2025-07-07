import pool from "./db.mjs";

const reservationTable = `
CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  salon_id INTEGER NOT NULL REFERENCES salon(id) ON DELETE CASCADE,
  service_type VARCHAR(100) NOT NULL,                    -- paslaugos tipas
  reservation_date DATE NOT NULL,                        -- data rezervavimo
  reservation_time TIME NOT NULL,                        -- laikas rezervavimo
  duration INTEGER DEFAULT 60,                           -- trukmė minutėmis
  status VARCHAR(20) DEFAULT 'pending',                  -- būsena: pending, confirmed, cancelled, completed
  notes TEXT,                                            -- papildomi komentarai
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,       -- sukūrimo data
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP        -- atnaujinimo data
);

-- Kuriami indeksai greitesnei paieškai
CREATE INDEX IF NOT EXISTS idx_reservations_user_id ON reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_salon_id ON reservations(salon_id);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);

-- Apribojimas: negalima rezervuoti to pačio laiko tame pačiame salone
CREATE UNIQUE INDEX IF NOT EXISTS idx_reservations_unique_time 
ON reservations(salon_id, reservation_date, reservation_time) 
WHERE status IN ('pending', 'confirmed');
`;

// Funkcija rezervacijų lentelės sukūrimui
export const createReservationTable = async () => {
  try {
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'reservations'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      await pool.query(reservationTable);
      console.log("✅ Rezervacijų lentelė sukurta sėkmingai.");
    } else {
      console.log("ℹ️  Rezervacijų lentelė jau egzistuoja.");
    }
  } catch (error) {
    console.error("❌ Klaida kuriant rezervacijų lentelę:", error);
    throw error;
  }
};
