import bcrypt from 'bcrypt';
import { createUser, getUserByEmail } from './models/userModel.mjs';

async function createAdmin() {
  try {
    const adminEmail = 'admin@test.com';
    
    // tikrinam ar adminas jau egzistuoja
    const existingAdmin = await getUserByEmail(adminEmail);
    if (existingAdmin) {
      console.log('✅ Admin jau yra:', existingAdmin.username);
      return;
    }

    // sukuriam admina
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await createUser('admin', adminEmail, hashedPassword, 'admin');
    
    console.log('✅ Admin sukurtas sekmingai :', admin);
  } catch (error) {
    console.error('❌ Klaida kuriant admina:', error);
  }
}

createAdmin();
