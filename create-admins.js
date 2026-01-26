// create-admins.js
// Скрипт для создания SQL команд для добавления администраторов
import crypto from 'crypto';

function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
  return { salt: salt.toString('base64'), hash: hash.toString('base64') };
}

// Список администраторов для создания
const admins = [
  {
    email: 'admin@samarqand-school.uz',
    password: 'Admin2026!Samarqand',
    name: 'Главный администратор',
    role: 'admin'
  },
  {
    email: 'uzpa.org@gmail.com',
    password: 'UZPA2026!Admin',
    name: 'Ассоциация психиатров',
    role: 'admin'
  },
  {
    email: 'sjunja@gmail.com',
    password: 'Dev2026!Samarqand',
    name: 'Разработчик',
    role: 'developer'
  }
];

console.log('-- SQL команды для создания администраторов');
console.log('-- Выполните в Cloudflare D1 Console или через wrangler');
console.log('-- https://dash.cloudflare.com → D1 → samarqand_school_db → Console\n');

admins.forEach((admin) => {
  const { salt, hash } = hashPassword(admin.password);
  const userId = crypto.randomUUID();

  console.log(`-- ${admin.name} (${admin.email})`);
  console.log(`INSERT INTO users (id, email, password_hash, password_salt, role, name, created_at)`);
  console.log(`VALUES (`);
  console.log(`  '${userId}',`);
  console.log(`  '${admin.email}',`);
  console.log(`  '${hash}',`);
  console.log(`  '${salt}',`);
  console.log(`  '${admin.role}',`);
  console.log(`  '${admin.name}',`);
  console.log(`  datetime('now')`);
  console.log(`);\n`);
});

console.log('\n-- Проверка созданных пользователей:');
console.log('SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC;');
