import bcrypt from 'bcrypt';
import { createUser, getUserByEmail } from './models/userModel.mjs';

async function createAdmin() {
  try {
    const adminEmail = 'admin@test.com';
    
    // Проверяем, есть ли уже админ
    const existingAdmin = await getUserByEmail(adminEmail);
    if (existingAdmin) {
      console.log('✅ Админ уже существует:', existingAdmin.username);
      return;
    }

    // Создаем админа
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await createUser('admin', adminEmail, hashedPassword, 'admin');
    
    console.log('✅ Админ создан успешно:', admin);
  } catch (error) {
    console.error('❌ Ошибка при создании админа:', error);
  }
}

createAdmin();
