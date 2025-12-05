# Platonus Mini App - Deployment Guide

## Деплой на Vercel

### Требования:
- GitHub аккаунт
- Vercel аккаунт (vercel.com)
- PostgreSQL БД (например, Neon или Railway)

### Шаг 1: Подготовка репозитория

1. Создай репозиторий на GitHub
2. Залей код:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/platonus-app.git
git branch -M main
git push -u origin main
```

### Шаг 2: Деплой Backend на Vercel

1. Перейди на [vercel.com](https://vercel.com)
2. Нажми "New Project"
3. Импортируй GitHub репозиторий
4. Выбери `apps/api` как root directory
5. Добавь Environment Variables:
   - `DATABASE_URL` - строка подключения к PostgreSQL
   - `JWT_SECRET` - случайная строка (минимум 32 символа)
   - `NODE_ENV` - production

Пример:
```
DATABASE_URL=postgresql://user:password@host:5432/platonus
JWT_SECRET=your-super-secret-random-key-here-min-32-chars
NODE_ENV=production
```

6. Нажми "Deploy"
7. После деплоя скопируй URL API (например: `https://platonus-api.vercel.app`)

### Шаг 3: Деплой Frontend на Vercel

1. Создай новый проект на Vercel
2. Импортируй тот же GitHub репозиторий
3. Выбери корень проекта (по умолчанию)
4. В "Build and Output Settings":
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. Добавь Environment Variable:
   - `VITE_API_URL` - URL твоего API бэкенда (из шага 2)

6. Нажми "Deploy"

### Шаг 4: Настройка Telegram Mini App

1. Перейди в [@BotFather](https://t.me/botfather) в Telegram
2. Выбери твоего бота или создай нового: `/newbot`
3. Выбери его команду: `/mybots` → выбери бота
4. Нажми "Menu Button"
5. Установи твой Frontend URL как веб-приложение

### Шаг 5: Миграция базы данных

После деплоя бэкенда нужно применить миграции:

```bash
# Локально с доступом к удаленной БД
cd apps/api
DATABASE_URL="your-production-db-url" npx prisma migrate deploy
```

Или через Vercel CLI:
```bash
vercel env pull # Скачать переменные окружения
DATABASE_URL="your-production-db-url" npx prisma migrate deploy
```

## Production Checklist

- [ ] Database URL установлен и БД доступна
- [ ] JWT_SECRET - сильный и случайный ключ
- [ ] Frontend URL указан в Telegram Bot Settings
- [ ] API URL правильно установлен во фронтенде
- [ ] Миграции БД применены
- [ ] Все Environment Variables установлены

## Useful Commands

```bash
# Проверить статус деплоя
vercel status

# Посмотреть логи
vercel logs --follow

# Переменные окружения
vercel env ls
vercel env pull
vercel env add NAME VALUE
```

## Troubleshooting

### "Cannot find module '@prisma/client'"
- Убедись что `postinstall` скрипт в package.json: `npx prisma generate`

### Database connection error
- Проверь DATABASE_URL формат
- Убедись что БД доступна с интернета
- Добавь IP адреса Vercel в whitelist БД

### Frontend не может подключиться к API
- Проверь VITE_API_URL
- Убедись что API URL указана без слэша в конце: `https://api.example.com`
- Проверь CORS в бэкенде

## Local Development

```bash
# Frontend
npm run dev

# Backend
cd apps/api
npm run dev

# Оба одновременно (нужен concurrently)
npm run dev:all
```
