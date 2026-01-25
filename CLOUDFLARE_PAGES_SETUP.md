# Cloudflare Pages Setup - Пошаговая инструкция

## 🎯 Цель
Развернуть сайт Самаркандской школы на Cloudflare Pages с подключением к D1 и R2.

---

## Шаг 1: Создание Pages проекта

### 1.1 Откройте Cloudflare Dashboard
- URL: https://dash.cloudflare.com
- Войдите в свой аккаунт

### 1.2 Перейдите в Workers & Pages
- В левом меню найдите **Workers & Pages**
- Кликните на него

### 1.3 Создайте приложение
- Нажмите кнопку **Create application** (справа вверху)
- Выберите вкладку **Pages**
- Нажмите **Connect to Git**

### 1.4 Подключите GitHub
1. Нажмите **Connect GitHub**
2. Если появится окно авторизации GitHub:
   - Нажмите **Authorize Cloudflare Pages**
   - Подтвердите пароль, если потребуется
3. Выберите **Only select repositories**
4. Найдите и выберите: **Sjunja/samarqand-spring-school**
5. Нажмите **Install & Authorize**

### 1.5 Настройте проект

Вы попадете на страницу настройки. Заполните поля:

```
┌─────────────────────────────────────────────────┐
│ Set up builds and deployments                   │
├─────────────────────────────────────────────────┤
│                                                 │
│ Project name                                    │
│ ┌─────────────────────────────────────────────┐ │
│ │ samarqand-school                            │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ Production branch                               │
│ ┌─────────────────────────────────────────────┐ │
│ │ main                               ▼       │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ Framework preset                                │
│ ┌─────────────────────────────────────────────┐ │
│ │ None                               ▼       │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ Build command                                   │
│ ┌─────────────────────────────────────────────┐ │
│ │ cd code/samarqand-school && npm ci &&       │ │
│ │ npm run build                               │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ Build output directory                          │
│ ┌─────────────────────────────────────────────┐ │
│ │ code/samarqand-school/dist                  │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ Root directory (optional)                       │
│ ┌─────────────────────────────────────────────┐ │
│ │ /                                           │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
└─────────────────────────────────────────────────┘
```

**ВАЖНО**: Используйте `npm ci` вместо `npm install` для более быстрой установки.

### 1.6 Добавьте Environment Variables

Прокрутите вниз до раздела **Environment variables (advanced)**

Нажмите **Add variable** и добавьте каждую из этих переменных:

```
Variable name: MAIL_FROM
Value: noreply@samarqand-school.uz
(или ваш реальный домен)

Variable name: MAIL_FROM_NAME
Value: Samarqand Spring School

Variable name: MAIL_REPLY_TO
Value: uzpa.org@gmail.com

Variable name: SCHOOL_EMAIL
Value: uzpa.org@gmail.com

Variable name: DEVELOPER_EMAILS
Value: your-email@example.com
(замените на ваш реальный email)
```

### 1.7 Запустите первый деплой

- Нажмите **Save and Deploy**
- Cloudflare начнет сборку проекта
- Это займет 3-5 минут

⏳ **Подождите завершения сборки!** Не переходите к следующему шагу, пока деплой не завершится.

---

## Шаг 2: Настройка Bindings (ПОСЛЕ первого деплоя)

### 2.1 Откройте настройки проекта

После успешного деплоя:
1. Вы увидите сообщение "Success! Your site is live!"
2. Нажмите на название проекта **samarqand-school** вверху страницы
3. Перейдите на вкладку **Settings**
4. Прокрутите вниз до раздела **Functions**

### 2.2 Добавьте D1 Database Binding

1. Найдите секцию **D1 database bindings**
2. Нажмите **Add binding**
3. Заполните:
   ```
   Variable name: DB
   D1 database: samarqand_school_db
   ```
4. Нажмите **Save**

### 2.3 Добавьте R2 Bucket Binding

1. Найдите секцию **R2 bucket bindings** (ниже D1)
2. Нажмите **Add binding**
3. Заполните:
   ```
   Variable name: REGISTRATION_FILES
   R2 bucket: samarqand-school-db
   ```
4. Нажмите **Save**

### 2.4 Проверьте bindings

После сохранения вы должны увидеть:

```
D1 database bindings
┌──────────────────┬──────────────────────┐
│ Variable name    │ D1 database          │
├──────────────────┼──────────────────────┤
│ DB               │ samarqand_school_db  │
└──────────────────┴──────────────────────┘

R2 bucket bindings
┌──────────────────────┬──────────────────────┐
│ Variable name        │ R2 bucket            │
├──────────────────────┼──────────────────────┤
│ REGISTRATION_FILES   │ samarqand-school-db  │
└──────────────────────┴──────────────────────┘
```

### 2.5 Повторный деплой

После добавления bindings Cloudflare автоматически:
- ✅ Инициирует новый деплой
- ✅ Подключит D1 и R2
- ✅ Через 2-3 минуты сайт будет полностью рабочим

---

## Шаг 3: Проверка работы сайта

### 3.1 Откройте сайт

Перейдите на вкладку **Deployments**
Найдите последний успешный деплой (зеленая галочка)
Нажмите **Visit site** или скопируйте URL

Ваш сайт будет доступен по адресу:
```
https://samarqand-school.pages.dev
```

### 3.2 Проверьте функционал

Протестируйте следующие страницы:

- ✅ Главная страница
- ✅ О школе
- ✅ Программа
- ✅ Регистрация (попробуйте зарегистрироваться)
- ✅ Подача тезисов
- ✅ Новости
- ✅ Контакты

### 3.3 Проверьте регистрацию

1. Откройте страницу регистрации
2. Заполните форму тестовыми данными
3. Загрузите файл подтверждения членства
4. Отправьте форму
5. Проверьте email (должно прийти письмо с подтверждением)

### 3.4 Проверьте Developer Dashboard

1. Откройте https://samarqand-school.pages.dev/developer
2. Cloudflare Access должен запросить аутентификацию
3. После входа вы увидите дашборд с:
   - Количество регистраций
   - Список участников
   - Статистика

---

## Шаг 4: Настройка Cloudflare Access (Опционально)

### 4.1 Защита /developer

1. В Cloudflare Dashboard перейдите в **Zero Trust**
2. **Access** → **Applications**
3. Нажмите **Add an application**
4. Выберите **Self-hosted**
5. Заполните:
   ```
   Application name: Samarqand School Developer Panel
   Session Duration: 24 hours
   Application domain: samarqand-school.pages.dev
   Path: /developer
   ```
6. В Policies:
   - Policy name: Developer Access
   - Action: Allow
   - Include: Emails → укажите ваш email
7. Сохраните

---

## Шаг 5: Настройка кастомного домена (Опционально)

Если у вас есть свой домен (например, samarqand-school.uz):

### 5.1 Добавьте домен

1. В настройках проекта → **Custom domains**
2. Нажмите **Set up a custom domain**
3. Введите ваш домен: `samarqand-school.uz`
4. Нажмите **Continue**

### 5.2 Настройте DNS

Cloudflare покажет DNS записи, которые нужно добавить:

```
Type: CNAME
Name: samarqand-school.uz (или @)
Content: samarqand-school.pages.dev
```

Добавьте эту запись в DNS вашего домена.

### 5.3 Подождите активации

DNS изменения могут занять до 24 часов, но обычно это 5-10 минут.

---

## 📊 Мониторинг и логи

### Просмотр логов деплоя
1. **Deployments** → выберите деплой
2. Нажмите на него
3. Смотрите **Build log** и **Function log**

### Просмотр логов Functions
1. **Functions** → **Real-time Logs**
2. Здесь отображаются все запросы к API

### Аналитика
1. **Analytics** → **Web Analytics**
2. Статистика посещений, запросов, ошибок

---

## 🆘 Решение проблем

### Ошибка при сборке: "npm ERR!"

**Решение**: Проверьте Build command, используйте `npm ci` вместо `npm install`

### Ошибка 404 на страницах

**Решение**: Проверьте файл `public/_redirects`:
```
/*    /index.html   200
```

### API endpoints возвращают 500

**Решение**:
1. Проверьте, что bindings настроены (D1 и R2)
2. Проверьте Function logs на ошибки
3. Убедитесь, что таблицы в D1 созданы

### Email не отправляются

**Решение**:
1. Проверьте переменные `MAIL_FROM` и `SCHOOL_EMAIL`
2. MailChannels работает только на Cloudflare Workers/Pages
3. Проверьте Function logs для ошибок отправки

---

## ✅ Чеклист готовности

После выполнения всех шагов проверьте:

- ✅ Сайт открывается по адресу *.pages.dev
- ✅ Все страницы загружаются
- ✅ Регистрация работает
- ✅ Файлы загружаются
- ✅ Email-уведомления приходят
- ✅ Developer dashboard доступен
- ✅ Bindings D1 и R2 настроены
- ✅ Environment variables добавлены

---

## 🔄 Автоматические обновления

Теперь при каждом `git push` в main ветку:
1. GitHub уведомит Cloudflare
2. Cloudflare автоматически:
   - Склонирует новый код
   - Соберет проект
   - Задеплоит обновления
3. Обновления будут видны через 2-5 минут

Проверить статус деплоя: **Deployments** → смотрите последний деплой

---

## 🎉 Готово!

После выполнения всех шагов ваш сайт полностью работает!

**Live URL**: https://samarqand-school.pages.dev
**GitHub**: https://github.com/Sjunja/samarqand-spring-school
**Dashboard**: https://dash.cloudflare.com

Если возникли проблемы - смотрите раздел "Решение проблем" выше или обращайтесь за помощью.
