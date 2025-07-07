import { getAllUsers } from './models/userModel.mjs';

async function listUsers() {
  try {
    const users = await getAllUsers();
    console.log('📋 Список всех пользователей:');
    users.forEach(user => {
      console.log(`ID: ${user.id}, Username: ${user.username}, Email: ${user.email}, Role: ${user.role}`);
    });
  } catch (error) {
    console.error('❌ Ошибка при получении пользователей:', error);
  }
}

listUsers();
