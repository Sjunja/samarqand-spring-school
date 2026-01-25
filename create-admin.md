# Создание администратора через API

## Способ 1: Через Developer Dashboard API

Используйте `curl` или Postman для создания пользователя:

```bash
curl -X POST https://samarqand-spring-school.pages.dev/api/dev/create-user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your-secure-password",
    "name": "Администратор",
    "role": "admin"
  }'
```

**Примечание**: Этот endpoint должен быть защищен через Cloudflare Access!

---

## Способ 2: Напрямую через D1 базу данных

Если у вас есть доступ к Wrangler CLI:

### 1. Создайте скрипт для хеширования пароля

Создайте файл `create-admin.js`:

```javascript
// create-admin.js
import crypto from 'crypto';

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

const email = 'admin@example.com';
const password = 'your-secure-password'; // ЗАМЕНИТЕ НА РЕАЛЬНЫЙ ПАРОЛЬ
const name = 'Администратор';
const role = 'admin';

const { salt, hash } = hashPassword(password);
const userId = crypto.randomUUID();

console.log(`
-- SQL для создания администратора
INSERT INTO users (id, email, password_hash, password_salt, role, name, created_at)
VALUES (
  '${userId}',
  '${email}',
  '${hash}',
  '${salt}',
  '${role}',
  '${name}',
  datetime('now')
);
`);
```

### 2. Запустите скрипт

```bash
node create-admin.js
```

### 3. Выполните SQL в D1

Скопируйте полученный SQL и выполните:

```bash
wrangler d1 execute samarqand_school_db --remote --command="[ВСТАВЬТЕ SQL]"
```

Или через Cloudflare Dashboard:
1. **Workers & Pages** → **D1 SQL Database**
2. Откройте базу **samarqand_school_db**
3. Перейдите в **Console**
4. Вставьте SQL и нажмите **Execute**

---

## Способ 3: Временно разрешить публичный доступ к `/api/dev/create-user`

**ВНИМАНИЕ**: Только для первоначальной настройки! Потом ОБЯЗАТЕЛЬНО закройте доступ!

### 1. Временно отключите проверку в функции

Отредактируйте `functions/api/dev/create-user.ts` и закомментируйте проверку Cloudflare Access:

```typescript
export async function onRequestPost(context: RequestContext) {
  // ВРЕМЕННО ОТКЛЮЧЕНО - УДАЛИТЕ ПОСЛЕ СОЗДАНИЯ АДМИНА!
  // const cfAccess = context.request.headers.get('Cf-Access-Authenticated-User-Email');
  // if (!cfAccess) {
  //   return jsonResponse({ error: 'Unauthorized' }, 401);
  // }

  // ... остальной код
}
```

### 2. Закоммитьте и задеплойте

```bash
git add .
git commit -m "Temp: allow public access to create-user"
git push
```

### 3. Создайте администратора через браузер

Откройте Developer Tools (F12) → Console и выполните:

```javascript
fetch('https://samarqand-spring-school.pages.dev/api/dev/create-user', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'your-secure-password',
    name: 'Администратор',
    role: 'admin'
  })
})
.then(r => r.json())
.then(console.log);
```

### 4. СРАЗУ ВЕРНИТЕ ЗАЩИТУ ОБРАТНО!

```bash
git revert HEAD
git push
```

---

## Проверка созданного пользователя

После создания проверьте через D1:

```bash
wrangler d1 execute samarqand_school_db --remote --command="SELECT id, email, name, role FROM users;"
```

Или через Cloudflare Dashboard → D1 → Console:

```sql
SELECT id, email, name, role, created_at FROM users;
```

---

## Безопасность

1. ✅ Developer Dashboard (`/developer`) ВСЕГДА защищен через Cloudflare Access
2. ✅ API `/api/dev/*` ВСЕГДА проверяет Cloudflare Access header
3. ✅ Admin Dashboard (`/admin`) требует логин/пароль
4. ❌ НИКОГДА не оставляйте `/api/dev/create-user` открытым публично
5. ✅ Используйте сильные пароли для администраторов
6. ✅ Email для DEVELOPER_EMAILS должны совпадать с Cloudflare Access

---

## Рекомендуемый порядок действий

1. Настройте Cloudflare Access для `/developer`
2. Откройте Developer Dashboard
3. Создайте администратора через UI
4. Войдите в Admin Dashboard
5. Создайте других администраторов через Admin Dashboard (если нужно)
