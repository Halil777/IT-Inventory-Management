# IT Inventory Management — Fullstack Setup

This repository contains a NestJS backend and a Next.js frontend.

- Backend: `backend/` (NestJS + TypeORM + Postgres)
- Frontend: `it-admin-panel/` (Next.js 15 + React 19)

## Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- A running PostgreSQL instance

## Configure Environment

1) Backend (`backend/.env` — copy from `.env.example`):

```
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=it_inventory
FRONTEND_ORIGIN=http://localhost:3000
```

2) Frontend (`it-admin-panel/.env.local` — copy from `.env.local.example`):

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Install Dependencies

From each project directory:

```
cd backend
npm install

cd ../it-admin-panel
npm install
```

## Run Locally

- Backend (Nest):

```
cd backend
npm run start:dev
```

- Frontend (Next):

```
cd it-admin-panel
npm run dev
```

The backend listens on `http://localhost:3001` and has CORS enabled for the frontend origin. The frontend uses `NEXT_PUBLIC_API_URL` to call the backend (e.g., `/departments`, `/employees`, etc.).

## Notes

- TypeORM `synchronize: true` is for development only. Disable it for production and use migrations instead.
- Avoid hardcoding database credentials. Use environment variables.
- If you change ports or origins, update both env files accordingly.
