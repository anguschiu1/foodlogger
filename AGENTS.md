# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Food Logger with Image Recognition — a Nuxt 3 + Express monorepo (no workspace manager). Two independent services in `frontend/` and `backend/`, each with their own `package.json` and `package-lock.json`.

### Services

| Service | Directory | Dev command | Port | Notes |
|---------|-----------|-------------|------|-------|
| Backend API | `backend/` | `npm run dev` | 4000 | Express 5 + TypeScript, SQLite via Sequelize. Start first. |
| Frontend | `frontend/` | `npm run dev` | 3000 | Nuxt 3. Proxies `/api/` to backend at `localhost:4000`. |

### Key startup caveats

- **Backend `.env` required**: Copy `backend/_.env` to `backend/.env` before first run. The update script handles this automatically (no-clobber copy).
- **SQLite resets on every backend restart**: The backend uses `sequelize.sync({ force: true })`, which drops and recreates all tables on startup. No migrations needed, but data is ephemeral.
- **Start order matters**: Start the backend before the frontend; the frontend proxies API calls to `localhost:4000`.
- **Frontend lint has pre-existing errors**: `npm run lint` in `frontend/` exits non-zero due to `@typescript-eslint/no-explicit-any` in generated shadcn-vue auto-form components. These are not regressions.

### Commands reference

See `README.md` for full details. Quick reference:

- **Backend tests**: `cd backend && npx vitest run`
- **Frontend lint**: `cd frontend && npm run lint`
- **Backend build**: `cd backend && npm run build`
- **Frontend build**: `cd frontend && npm run build`

### API endpoints

The OpenAPI spec is at `backend/src/api_v1.yaml`. Key routes:
- `POST /users` — register
- `POST /users/login` — login
- `GET /users/{user_id}` — get user profile
- `POST /foodlogs/{user_id}` — create food log
- `GET /foodlogs/{user_id}` — get food logs
- `DELETE /foodlogs/{user_id}/{foodlog_id}` — delete food log
