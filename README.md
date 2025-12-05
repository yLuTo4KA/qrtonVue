# Platonus - Telegram Mini App

Telegram Mini App для управления посещаемостью и профилями пользователей.

## Стек технологий

**Frontend:**
- Vue 3 + TypeScript
- Vite
- Pinia (State Management)
- Vue Router
- @tma.js/sdk-vue (Telegram Integration)

**Backend:**
- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT Authentication
- tsx (TypeScript runtime)

## Установка зависимостей

```bash
npm install
cd apps/api && npm install && cd ../..
```

## Скрипты

### Frontend & Backend вместе

```bash
npm run dev          # Запустить оба сервера в dev режиме
npm run build        # Собрать фронтенд для продакшена
```

### Только Frontend

```bash
npm run dev          # Локальный dev сервер на :5173
npm run build        # Сборка для продакшена
npm run preview      # Preview собранной версии
npm run lint         # Проверка кода
npm run type-check   # TypeScript проверка типов
```

### Только Backend

```bash
cd apps/api
npm run dev          # Локальный dev сервер на :3001
npm run build        # Собрать для продакшена
npm run lint         # Проверка кода
```

### Database & Prisma

```bash
cd apps/api
npx prisma migrate dev     # Создать и применить миграцию
npx prisma studio         # Открыть Prisma Studio UI
npx prisma generate       # Регенерировать Prisma клиент
```

## Разработка

### Требования

- Node.js 18+
- npm (или другой пакетный менеджер)
- PostgreSQL (локально или удаленно)

### Локальное окружение

1. Клонируй репозиторий:
```bash
git clone https://github.com/yourusername/platonus-app.git
cd platonus-app
```

2. Установи зависимости:
```bash
npm install
cd apps/api && npm install && cd ../..
```

3. Создай `.env` файлы:

**Frontend** (`.env`):
```env
VITE_API_URL=http://localhost:3001
```

**Backend** (`apps/api/.env`):
```env
DATABASE_URL=postgresql://user:password@localhost:5432/platonus
JWT_SECRET=your-secret-key-here
NODE_ENV=development
API_PORT=3001
```

4. Применить миграции БД:
```bash
cd apps/api
npx prisma migrate deploy
cd ../..
```

5. Запустить оба сервера:
```bash
npm run dev
```

Frontend будет доступен на `http://localhost:5173`
Backend будет доступен на `http://localhost:3001`

## Деплой на Vercel

Полная инструкция в файле [DEPLOYMENT.md](./DEPLOYMENT.md)

Быстрый старт:
```bash
# Установить Vercel CLI
npm i -g vercel

# Залогиниться
vercel login

# Запустить скрипт деплоя
bash deploy.sh
```

## Структура проекта

```
platonus-app/
├── src/                    # Frontend код
│   ├── pages/             # Vue страницы
│   ├── components/        # Vue компоненты
│   ├── stores/            # Pinia store
│   ├── router/            # Vue Router
│   └── ...
├── apps/api/              # Backend код
│   ├── api/               # Express приложение
│   ├── middleware/        # Express middleware
│   ├── utils/             # Утилиты
│   ├── prisma/            # Prisma schema & миграции
│   └── scripts/           # Скрипты (seed, etc)
├── vercel.json            # Vercel конфиг (frontend)
├── DEPLOYMENT.md          # Инструкции по деплою
└── package.json           # Корневые зависимости
```

## Основные функции

- 🔐 Аутентификация через Telegram
- 👥 Управление группами
- 👤 Профили пользователей
- 📅 Отслеживание посещаемости
- 🎯 Выбор устройства (user-agent)
- 📱 Telegram Mini App интеграция

## API Endpoints

### Authentication
- `POST /api/auth/register` - Регистрация/вход через Telegram

### Profile
- `GET /api/user/profile` - Получить профиль
- `PUT /api/user/profile` - Обновить профиль

### Groups
- `POST /api/group/create` - Создать группу
- `GET /api/group/:groupId` - Получить группу с членами
- `GET /api/groups` - Получить все группы
- `POST /api/group/join/:groupId` - Присоединиться к группе
- `DELETE /api/group/:groupId/member/:userId` - Удалить члена группы
- `DELETE /api/group/:groupId` - Удалить группу

### Attendance
- `GET /api/group/:groupId/attendance` - Получить посещаемость группы

## Переменные окружения

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:3001
```

### Backend (`apps/api/.env`)
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_EXPIRY=30d
NODE_ENV=development
API_PORT=3001
```

## Troubleshooting

### Port already in use
```bash
# Найти процесс на порту
lsof -i :5173    # Frontend
lsof -i :3001    # Backend

# Убить процесс
kill -9 <PID>
```

### Database connection error
- Проверь DATABASE_URL
- Убедись что PostgreSQL запущена
- Проверь credentials

### Prisma client not found
```bash
cd apps/api
npx prisma generate
```

## Лицензия

MIT

on how to do it.

## Run

Although Mini Apps are designed to be opened
within [Telegram applications](https://docs.telegram-mini-apps.com/platform/about#supported-applications),
you can still develop and test them outside of Telegram during the development
process.

To run the application in the development mode, use the `dev` script:

```bash
npm run dev:https
```

> [!NOTE]
> As long as we use [vite-plugin-mkcert](https://www.npmjs.com/package/vite-plugin-mkcert),
> launching the dev mode for the first time, you may see sudo password request.
> The plugin requires it to properly configure SSL-certificates. To disable the plugin, use
> the `npm run dev` command.

After this, you will see a similar message in your terminal:

```bash
VITE v5.2.12  ready in 237 ms

➜  Local:   https://localhost:5173/vuejs-template
➜  Network: https://192.168.0.109:5173/vuejs-template

➜  press h + enter to show help
```

Here, you can see the `Local` link, available locally, and `Network` links
accessible to all devices in the same network with the current device.

To view the application, you need to open the `Local`
link (`https://localhost:5173/reactjs-template` in this example) in your
browser:

![Application](assets/application.png)

It is important to note that some libraries in this template, such as
`@tma.js/sdk`, are not intended for use outside of Telegram.

Nevertheless, they appear to function properly. This is because the
`src/mockEnv.ts` file, which is imported in the application's entry point (
`src/index.ts`), employs the `mockTelegramEnv` function to simulate the Telegram
environment. This trick convinces the application that it is running in a
Telegram-based environment. Therefore, be cautious not to use this function in
production mode unless you fully understand its implications.

> [!WARNING]
> Because we are using self-signed SSL certificates, the Android and iOS
> Telegram applications will not be able to display the application. These
> operating systems enforce stricter security measures, preventing the Mini App
> from loading. To address this issue, refer to
> [this guide](https://docs.telegram-mini-apps.com/platform/getting-app-link#remote).

## Deploy

This boilerplate uses GitHub Pages as the way to host the application
externally. GitHub Pages provides a CDN which will let your users receive the
application rapidly. Alternatively, you could use such services
as [Heroku](https://www.heroku.com/) or [Vercel](https://vercel.com).

### Manual Deployment

This boilerplate uses the [gh-pages](https://www.npmjs.com/package/gh-pages)
tool, which allows deploying your application right from your PC.

#### Configuring

Before running the deployment process, ensure that you have done the following:

1. Replaced the `homepage` value in `package.json`. The GitHub Pages deploy tool
   uses this value to
   determine the related GitHub project.
2. Replaced the `base` value in `vite.config.ts` and have set it to the name of
   your GitHub
   repository. Vite will use this value when creating paths to static assets.

For instance, if your GitHub username is `telegram-mini-apps` and the repository
name is `is-awesome`, the value in the `homepage` field should be the following:

```json
{
  "homepage": "https://telegram-mini-apps.github.io/is-awesome"
}
```

And `vite.config.ts` should have this content:

```ts
export default defineConfig({
  base: '/is-awesome/',
  // ...
});
```

You can find more information on configuring the deployment in the `gh-pages`
[docs](https://github.com/tschaub/gh-pages?tab=readme-ov-file#github-pages-project-sites).

#### Before Deploying

Before deploying the application, make sure that you've built it and going to
deploy the fresh static files:

```bash
npm run build
```

Then, run the deployment process, using the `deploy` script:

```Bash
npm run deploy
```

After the deployment completed successfully, visit the page with data according
to your username and repository name. Here is the page link example using the
data mentioned above:
https://telegram-mini-apps.github.io/is-awesome

### GitHub Workflow

To simplify the deployment process, this template includes a
pre-configured [GitHub workflow](.github/workflows/github-pages-deploy.yml) that
automatically deploys the project when changes are pushed to the `master`
branch.

To enable this workflow, create a new environment (or edit the existing one) in
the GitHub repository settings and name it `github-pages`. Then, add the
`master` branch to the list of deployment branches.

You can find the environment settings using this
URL: `https://github.com/{username}/{repository}/settings/environments`.

![img.png](.github/deployment-branches.png)

In case, you don't want to do it automatically, or you don't use GitHub as the
project codebase, remove the `.github` directory.

### GitHub Web Interface

Alternatively, developers can configure automatic deployment using the GitHub
web interface. To do this, follow the link:
`https://github.com/{username}/{repository}/settings/pages`.

## TON Connect

This boilerplate utilizes
the [TON Connect](https://docs.ton.org/develop/dapps/ton-connect/overview)
project to demonstrate how developers can integrate functionality related to TON
cryptocurrency.

The TON Connect manifest used in this boilerplate is stored in the `public`
folder, where all publicly accessible static files are located. Remember
to [configure](https://docs.ton.org/develop/dapps/ton-connect/manifest) this
file according to your project's information.

## Useful Links

- [Platform documentation](https://docs.telegram-mini-apps.com/)
- [@tma.js/sdk-vue documentation](https://docs.telegram-mini-apps.com/packages/tma-js-sdk-vue)
- [Telegram developers community chat](https://t.me/devs_cis)
