# Пошаговое руководство деплоя на Vercel

## Шаг 1️⃣: Создай PostgreSQL БД (5 минут)

### Вариант A: Neon (РЕКОМЕНДУЕТСЯ)

1. Перейди на https://neon.tech
2. Sign Up → создай аккаунт
3. Создай новый проект (назови `platonus`)
4. После создания проекта перейди в **Connection String**
5. Выбери режим "Connection pooling" → "Session" для надежности
6. Скопируй строку вида:
```
postgresql://user:password@ep-xxx.neon.tech/platonus?sslmode=require
```
7. ✅ **Сохрани эту строку** — она тебе будет нужна

### Вариант B: Railway

1. Перейди на https://railway.app
2. Sign Up
3. Create a New Project → PostgreSQL
4. Ожидай пока БД создаст (займет ~1-2 минуты)
5. Перейди на вкладку "Data" → скопируй `DATABASE_URL`
6. ✅ **Сохрани эту строку**

---

## Шаг 2️⃣: Деплой Backend на Vercel (10 минут)

1. Перейди на https://vercel.com
2. **Sign Up / Sign In**
3. Нажми **"Add New..."** → **"Project"**
4. Выбери GitHub репозиторий `platonus-vue-app`
5. На экране проекта **очень важно**:
   - **Root Directory:** выбери `apps/api` (не главную папку!)
   - **Framework:** оставь "Other" (Vercel автоматически определит)

6. **ПЕРЕД нажатием "Deploy"** добавь Environment Variables:
   - Нажми **"Environment Variables"** в левом меню
   - Добавь три переменные:

| Ключ | Значение | Комментарий |
|------|---------|-----------|
| `DATABASE_URL` | Строка из Шага 1 | Полная строка подключения к PostgreSQL |
| `JWT_SECRET` | `some-long-random-secret-min-32-chars-here` | Придумай свою случайную строку (минимум 32 символа) |
| `NODE_ENV` | `production` | Обязательно это значение |

7. Теперь нажми **"Deploy"**
8. Ожидай деплоя (займет ~2-5 минут)
9. Когда увидишь "Congratulations" → 🎉 успешно!
10. Скопируй URL бэкенда (будет в правом верхнем углу, что-то типа `https://platonus-api.vercel.app`)
11. ✅ **Сохрани этот URL** — будет нужен для фронтенда

---

## Шаг 3️⃣: Деплой Frontend на Vercel (10 минут)

1. На главной странице Vercel нажми **"Add New..."** → **"Project"**
2. Импортируй **тот же GitHub репозиторий** еще раз
3. **ВАЖНО - Root Directory:** оставь пустым или `/` (это главная папка)
4. Убедись что:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. **Перед Deploy** добавь Environment Variable:
   - **`VITE_API_URL`** = URL из Шага 2 (например `https://platonus-api.vercel.app`)
   - ❌ БЕЗ слэша в конце!

6. Нажми **"Deploy"**
7. Ожидай деплоя (~2-3 минуты)
8. Скопируй URL фронтенда (что-то типа `https://platonus.vercel.app`)
9. ✅ **Сохрани этот URL**

---

## Шаг 4️⃣: Настрой Telegram Mini App (2 минуты)

1. Открой Telegram и найди **@BotFather**
2. Отправь команду `/mybots`
3. Выбери своего бота
4. Нажми **"Menu Button"**
5. Нажми **"Web App"**
6. Вставь URL фронтенда из Шага 3 (например `https://platonus.vercel.app`)
7. Готово! ✅

---

## Шаг 5️⃣: Первый запуск (5 минут)

1. Открой Telegram
2. Найди своего бота
3. Нажми кнопку **"Запустить Web App"**
4. Должно открыться твое приложение 🎉

### Проверь функции:
- ✅ Вход через Telegram
- ✅ Профиль загружается
- ✅ Можно создать группу
- ✅ Можно выбрать девайс
- ✅ Страница посещаемости работает

---

## ⚠️ Если что-то не работает

### Ошибка: "Can't connect to API"
**Решение:**
1. Проверь `VITE_API_URL` во фронтенде (Settings → Environment Variables)
2. Убедись что URL без слэша в конце
3. Открой браузер консоль (F12) и посмотри ошибку сети

### Ошибка: "Database connection error" в API логах
**Решение:**
1. Проверь `DATABASE_URL` в бэкенде (Settings → Environment Variables)
2. Если используешь Neon/Railway, убедись что IP адреса Vercel в whitelist
3. Попробуй скопировать CONNECTION STRING еще раз

### Приложение загружается но тусклое/ничего не видно
**Решение:**
1. Это может быть проблема инициализации Telegram Web App API
2. Проверь что `@tma.js/sdk-vue` импортируется в `main.ts`
3. Проверь console tab в F12 DevTools

### Миграции БД не применились
**Решение:**
1. Открой Vercel проект бэкенда
2. Перейди на вкладку "Deployments"
3. Нажми на последний деплой
4. Посмотри логи (нажми "View Build Logs")
5. Если видишь ошибку миграции:
   ```bash
   cd apps/api
   vercel env pull
   npx prisma migrate deploy
   ```

---

## 🎉 Готово!

Твое приложение теперь запущено на Vercel и доступно в Telegram!

### Дальше можешь:
- 🔧 Делать изменения в коде и коммитить в GitHub
- 📈 Vercel автоматически переразвернёт проект
- 📊 Смотреть логи и аналитику в Vercel дашборде
- 🗄️ Управлять БД через Neon/Railway консоль

