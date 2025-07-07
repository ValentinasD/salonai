import pool from '../DB_config/db.mjs';

// 📥 gauti visas rezervacijas
export const getUserReservations = async (req, res) => {
  const userId = req.user.id; // Iš middleware autentifikavimo

  try {
    const result = await pool.query(`
      SELECT 
        r.id, r.service_type, r.reservation_date, r.reservation_time, 
        r.duration, r.status, r.notes, r.created_at,
        s.salon as salon_name, s.category as salon_category
      FROM reservations r
      JOIN salon s ON r.salon_id = s.id
      WHERE r.user_id = $1
      ORDER BY r.reservation_date DESC, r.reservation_time DESC
    `, [userId]);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Klaida gaunant rezervacijas:', err);
    res.status(500).json({ message: 'Serverio klaida.' });
  }
};

// 📥 gauti visas rezervacijas tik admin
export const getAllReservations = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        r.id, r.service_type, r.reservation_date, r.reservation_time, 
        r.duration, r.status, r.notes, r.created_at,
        s.salon as salon_name, s.category as salon_category,
        u.username, u.email
      FROM reservations r
      JOIN salon s ON r.salon_id = s.id
      JOIN users u ON r.user_id = u.id
      ORDER BY r.reservation_date DESC, r.reservation_time DESC
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ klaida gaunant rezervacija :', err);
    res.status(500).json({ message: 'serverio klaida.' });
  }
};

// 📝 sukurti nauja rezervacija 
export const createReservation = async (req, res) => {
  const userId = req.user.id;
  const { salon_id, service_type, reservation_date, reservation_time, duration, notes } = req.body;

  // Validacija
  if (!salon_id || !service_type || !reservation_date || !reservation_time) {
    return res.status(400).json({ 
      message: 'Salonas, paslaugos tipas, data ir laikas yra privalomi.' 
    });
  }

  // Tikrinami, kad data nebūtų praeityje
  const reservationDateTime = new Date(`${reservation_date}T${reservation_time}`);
  if (reservationDateTime <= new Date()) {
    return res.status(400).json({ 
      message: 'Negalima rezervuoti laiko praeityje.' 
    });
  }

  try {
    // Tikrinami, kad salonas egzistuoja
    const salonCheck = await pool.query('SELECT id FROM salon WHERE id = $1', [salon_id]);
    if (salonCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Salonas nerastas.' });
    }

    // Tikrinami, kad laikas būtų laisvas
    const timeCheck = await pool.query(`
      SELECT id FROM reservations 
      WHERE salon_id = $1 AND reservation_date = $2 AND reservation_time = $3 
      AND status IN ('pending', 'confirmed')
    `, [salon_id, reservation_date, reservation_time]);

    if (timeCheck.rows.length > 0) {
      return res.status(409).json({ 
        message: 'Šis laikas jau rezervuotas.' 
      });
    }

    const result = await pool.query(`
      INSERT INTO reservations (user_id, salon_id, service_type, reservation_date, reservation_time, duration, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [userId, salon_id, service_type, reservation_date, reservation_time, duration || 60, notes]);

    res.status(201).json({
      message: 'Rezervacija sėkmingai sukurta.',
      reservation: result.rows[0]
    });
  } catch (err) {
    console.error('❌ Klaida kuriant rezervaciją:', err);
    
    if (err.code === '23505') { // Unique constraint violation
      return res.status(409).json({ 
        message: 'Šis laikas jau rezervuotas.' 
      });
    }
    
    res.status(500).json({ message: 'Serverio klaida.' });
  }
};

// ✏️ Обновить резервирование
export const updateReservation = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { service_type, reservation_date, reservation_time, duration, notes, status } = req.body;

  try {
    // tikriname, kad rezervacija priklauso vartotojui arba vartotojas yra admin
    let checkQuery = 'SELECT * FROM reservations WHERE id = $1';
    let checkParams = [id];

    if (req.user.role !== 'admin') {
      checkQuery += ' AND user_id = $2';
      checkParams.push(userId);
    }

    const existing = await pool.query(checkQuery, checkParams);
    if (existing.rows.length === 0) {Rezervacija nerasta .' });
    }

    // Jei atnaujinamos data/ laikas, tikriname, ar laikas laisvas
    if (reservation_date && reservation_time) {
      const timeCheck = await pool.query(`
        SELECT id FROM reservations 
        WHERE salon_id = $1 AND reservation_date = $2 AND reservation_time = $3 
        AND status IN ('pending', 'confirmed') AND id != $4
      `, [existing.rows[0].salon_id, reservation_date, reservation_time, id]);

      if (timeCheck.rows.length > 0) {
        return res.status(409).json({ 
          message: '^itas laikas jau rezervuotas.' 
        });
      }
    }

    const result = await pool.query(`
      UPDATE reservations 
      SET service_type = COALESCE($1, service_type),
          reservation_date = COALESCE($2, reservation_date),
          reservation_time = COALESCE($3, reservation_time),
          duration = COALESCE($4, duration),
          notes = COALESCE($5, notes),
          status = COALESCE($6, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `, [service_type, reservation_date, reservation_time, duration, notes, status, id]);

    res.status(200).json({
      message: 'Rezervacija sekmingai atnaujinta.',
      reservation: result.rows[0]
    });
  } catch (err) {
    console.error('❌ Klaida vigdant rezervacijos atnaujinima :', err);
    res.status(500).json({ message: 'serverio klaida .' });
  }
};

// 🗑️ i6trinti rezervacija 
export const deleteReservation = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    //tikriname, kad rezervacija priklauso vartotojui arba vartotojas yra admin
    let checkQuery = 'SELECT * FROM reservations WHERE id = $1';
    let checkParams = [id];

    if (req.user.role !== 'admin') {
      checkQuery += ' AND user_id = $2';
      checkParams.push(userId);
    }

    const existing = await pool.query(checkQuery, checkParams);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Rezervacija nerasta.' });
    }

    await pool.query('DELETE FROM reservations WHERE id = $1', [id]);

    res.status(200).json({ 
      message: 'Rezervacija sekmingai pa6alinta .' 
    });
  } catch (err) {
    console.error('❌ Klaida i6tinant rezervacija:', err);
    res.status(500).json({ message: 'serverio klaida.' });
  }
};

// 📊 gauti laikus 
export const getAvailableSlots = async (req, res) => {
  const { salon_id, date } = req.query;

  if (!salon_id || !date) {
    return res.status(400).json({ 
      message: 'ID салона и дата обязательны.' 
    });
  }

  try {
    // 
    const bookedSlots = await pool.query(`
      SELECT reservation_time, duration 
      FROM reservations 
      WHERE salon_id = $1 AND reservation_date = $2 
      AND status IN ('pending', 'confirmed')
      ORDER BY reservation_time
    `, [salon_id, date]);

   
    const allSlots = [];
    for (let hour = 9; hour < 18; hour++) {
      allSlots.push(`${hour.toString().padStart(2, '0')}:00`);
      allSlots.push(`${hour.toString().padStart(2, '0')}:30`);
    }

    
    const availableSlots = allSlots.filter(slot => {
      return !bookedSlots.rows.some(booked => {
        const bookedTime = booked.reservation_time;
        const bookedDuration = booked.duration;
        
        // laiku konfliktu patikra
        const slotTime = new Date(`2000-01-01T${slot}:00`);
        const bookedStart = new Date(`2000-01-01T${bookedTime}`);
        const bookedEnd = new Date(bookedStart.getTime() + bookedDuration * 60000);
        
        return slotTime >= bookedStart && slotTime < bookedEnd;
      });
    });

    res.status(200).json({
      date,
      salon_id,
      availableSlots,
      bookedSlots: bookedSlots.rows
    });
  } catch (err) {
    console.error('❌ Klaida gaunant laikus:', err);
    res.status(500).json({ message: 'serverio klaida .' });
  }
};
