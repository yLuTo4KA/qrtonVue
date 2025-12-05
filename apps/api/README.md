# Backend API для Platonus

Telegram Mini App Backend на Node.js с Express и Prisma.

## Установка

```bash
cd apps/api
npm install
```

## Конфигурация

1. Скопируй `.env.example` в `.env.local`:
```bash
cp .env.example .env.local
```

2. Заполни переменные окружения:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key для JWT
- `TELEGRAM_BOT_TOKEN` - Telegram Bot Token для верификации

## Разработка

```bash
npm run dev
```

## Миграции БД

```bash
npm run prisma:migrate
```

## API Endpoints

### Авторизация

#### POST `/api/auth/register`
Регистрация или вход пользователя через Telegram initData

Request:
```json
{
  "initData": "user=%7B%22id%22%3A123456789..."
}
```

Response:
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "telegramId": 123456789,
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "photoUrl": "https://...",
    "access": false,
    "admin": false
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### POST `/api/auth/verify`
Проверка валидности JWT токена

Headers:
```
Authorization: Bearer <token>
```

Response:
```json
{
  "valid": true,
  "user": {
    "id": "user_id",
    "telegramId": 123456789,
    "access": false,
    "admin": false
  }
}
```

### Пользователь

#### GET `/api/user/profile`
Получить профиль текущего пользователя

Headers:
```
Authorization: Bearer <token>
```

Response:
```json
{
  "id": "user_id",
  "telegramId": 123456789,
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "photoUrl": "https://...",
  "nickname": "John",
  "plt_login": "user@plateus.com",
  "plt_pass": "password",
  "access": false,
  "admin": false,
  "groupId": null,
  "createdAt": "2025-12-05T...",
  "updatedAt": "2025-12-05T..."
}
```

#### PUT `/api/user/profile`
Обновить профиль пользователя

Headers:
```
Authorization: Bearer <token>
```

Body:
```json
{
  "nickname": "John Doe",
  "plt_login": "user@plateus.com",
  "plt_pass": "password"
}
```

## Security

- ✅ Верификация Telegram hash
- ✅ JWT токены с expiration
- ✅ CORS защита
- ✅ Защита от auth_date (max 1 час)

## Vercel Deploy

1. Создай Vercel Postgres в Vercel Console
2. Скопируй connection string в environment variables
3. Deploy через `git push`

```bash
npm run prisma:migrate
npm run dev
```
