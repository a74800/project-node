# AGENTS.md — Task Manager (estudo-node)

## Architecture

| Package | Type | Entrypoint | Dev command | Notes |
|---------|------|------------|-------------|-------|
| `backend/` | Express 5 API (CommonJS) | `src/server.js` → `src/app.js` | `npm run dev` (nodemon) | Port 3000 |
| `consumer/` | RabbitMQ consumer (CommonJS) | `src/consumer.js` | `npm run dev` (node) | No nodemon |
| `frontend/` | Vue 3 + Vite (ESM) | `src/main.js` → `App.vue` | `npm run dev` (vite) | Port 5173 |
| `database/` | MySQL init | `init.sql` | — | Mounted as Docker entrypoint |

No root package.json — each package is standalone. Run `npm install` per package.

## Startup

### Docker (preferred)
```sh
docker compose up -d --build
```
Infra: MySQL (3307:3306), Redis (6379), RabbitMQ (5672, management 15672). All services wait for health checks.

### Local dev
Requires MySQL, Redis, RabbitMQ running on localhost. Then:
```sh
cd backend && npm install && npm run dev   # Port 3000
cd consumer && npm install && npm run dev  # (in separate terminal)
cd frontend && npm install && npm run dev  # Port 5173
```

## Key Details

- **Express 5** — routing uses `app.use('/tasks', taskRoutes)` with `router.use(authMiddleware)` for protection. Express 5 differs from Express 4 in error handling.
- **No tests configured** — `consumer/package.json` has a placeholder test script. No test framework.
- **No lint/typecheck** — no ESLint, Prettier, or TypeScript config.
- **JWT auth** — token stored in `localStorage`. Frontend axios interceptor attaches `Authorization: Bearer <token>`. On 401, clears storage and dispatches `auth:logout` event.
- **Env files** — `backend/.env` uses Docker service names (`mysql`, `redis`, `rabbitmq`); `consumer/.env` uses `localhost`. Backend `JWT_SECRET` and `JWT_EXPIRES_IN` are set in `docker-compose.yml`, not in `.env`.
- **RabbitMQ** — backend `utils/publisher.js` publishes to `task_events_exchange` (direct) → `task_events` queue. Dead-letter exchange (`task_events_dlx`) routes failures to `task_events_dlq`. Consumer auto-acks; nack without requeue on failure.
- **API base URL** — frontend hardcodes `http://localhost:3000` in `src/api/api.js`. No Vite proxy configured.
- **No Vue Router** — `App.vue` switches views with `v-if` on `currentView` ref.
- **HTTP tests** — `backend/testes.http` is for VS Code REST Client extension.

## Database (MySQL)

Tables: `users`, `tasks`, `task_events`. Init script at `database/init.sql`. Backend uses `mysql2/promise` connection pool.

## Branches

- `main` — production branch
- `joao-dev` — active development branch
