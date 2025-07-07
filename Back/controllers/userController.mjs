// controllers/userController.mjs
import { getUserById, getUserByEmail } from '../models/userModel.mjs';
import pool from '../DB_config/db.mjs';

// 📥 Gauti visus vartotojus (galima filtruoti pagal rolę, pvz. ?role=admin)
export const getAllUsers = async (req, res) => {
  const { role } = req.query;

  try {
    let result;

    if (role) {
      result = await pool.query(
        'SELECT id, username, email, role, created_at FROM users WHERE role = $1 ORDER BY created_at DESC',
        [role]
      );
    } else {
      result = await pool.query(
        'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC'
      );
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Klaida gaunant vartotojus:', err);
    res.status(500).json({ message: 'Serverio klaida.' });
  }
};


// 📥 Gauti vieną vartotoją pagal ID
export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: '❌ Vartotojas nerastas.' });
    }

    delete user.password; // pašalinam slaptažodį iš atsakymo
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Serverio klaida.' });
  }
};

// 🗑️ Ištrinti vartotoją
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.status(200).json({ message: '✅ Vartotojas ištrintas sėkmingai.' });
  } catch (err) {
    res.status(500).json({ message: 'Serverio klaida.' });
  }
};

// 🔄 Atnaujinti vartotojo duomenis
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, role } = req.body;

  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: '❌ Vartotojas nerastas.' });
    }

    // ❗ Tik admin gali keisti rolę
    let newRole = user.role;
    if (role && role !== user.role) {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: '❌ Tik administratorius gali keisti rolę.' });
      }
      newRole = role;
    }

    // Patikrinam ar email jau naudojamas
    if (email && email !== user.email) {
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: '❌ El. paštas jau naudojamas.' });
      }
    }

    await pool.query(
      'UPDATE users SET username = $1, email = $2, role = $3 WHERE id = $4',
      [username || user.username, email || user.email, newRole, id]
    );

    res.status(200).json({ message: '✅ Vartotojo duomenys atnaujinti sėkmingai.' });
  } catch (err) {
    console.error('❌ Klaida atnaujinant vartotoją:', err);
    res.status(500).json({ message: 'Serverio klaida.' });
  }
};



// 🔍 Ieškoti vartotojo pagal el. paštą 
export const searchUserByEmail = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: '❌ Nurodykite el. paštą paieškai.' });
  }

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: '❌ Vartotojas nerastas.' });
    }

    delete user.password; // pašalinam slaptažodį iš atsakymo
    res.status(200).json(user);
  } catch (err) {
    console.error('❌ Klaida ieškant vartotojo:', err);
    res.status(500).json({ message: 'Serverio klaida.' });
  }
};
