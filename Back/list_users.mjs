import { getAllUsers } from './models/userModel.mjs';

async function listUsers() {
  try {
    const users = await getAllUsers();
    console.log('📋 Sarašas visu vartotoju:');
    users.forEach(user => {
      console.log(`ID: ${user.id}, Username: ${user.username}, Email: ${user.email}, Role: ${user.role}`);
    });
  } catch (error) {
    console.error('❌ Klaida Gaunant vartotojus:', error);
  }
}

listUsers();
