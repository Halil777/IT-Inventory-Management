# Repository Guidelines

## Project Structure & Module Organization
- Backend (`backend`): NestJS + TypeScript. Domain modules under `src/*` (e.g., `devices`, `printers`, `employees`, `departments`, `consumables`). Standard Nest patterns: `*.module.ts`, `*.controller.ts`, `*.service.ts`, entities in `*.entity.ts`, DTOs in `dto/`.
- Admin UI (`it-admin-panel`): Next.js (App Router) + React + Tailwind. Pages/components under `app/` and `components/` (feature folders like `devices/`, `printers/`, plus shared `ui/`). Static assets in `public/`.
- Environment: Sample configs in `backend/.env.example` and `it-admin-panel/.env.local.example`.

## Build, Test, and Development Commands
- Backend dev: `cd backend && npm run start:dev` — run Nest with watch.
- Backend build: `cd backend && npm run build` — compile to `dist/`.
- Backend start (prod): `node dist/main.js` (after build).
- Backend lint: `cd backend && npm run lint` — ESLint over `src/`.
- Admin dev: `cd it-admin-panel && npm run dev` — Next.js dev server.
- Admin build/start: `cd it-admin-panel && npm run build && npm start`.
- Admin lint: `cd it-admin-panel && npm run lint`.

## Coding Style & Naming Conventions
- TypeScript, 2‑space indent, semicolons on; prefer explicit return types.
- Backend files/folders: kebab‑case; Nest artifacts: `*.module.ts`, `*.service.ts`, `*.controller.ts`, `*.entity.ts`.
- Frontend components: PascalCase filenames for React components, feature folders kebab‑case; Tailwind for styling.
- Linting: ESLint in both apps; run the lint scripts before committing.

## Testing Guidelines
- Backend: Jest is configured; place tests as `*.spec.ts` near sources (e.g., `src/devices/devices.service.spec.ts`). Run with `cd backend && npm test`.
- Admin UI: No tests defined yet; if adding, use Vitest or Jest + Testing Library and colocate as `*.test.tsx`.

## Commit & Pull Request Guidelines
- Commits: Use conventional prefixes and scopes, e.g., `feat(backend-devices): add pagination`, `fix(ui-notifications): close on route change`.
- PRs: Provide a clear summary, link issues, include screenshots/GIFs for UI changes, list breaking changes, and confirm `lint` and builds pass for both apps.

## Security & Configuration
- Never commit secrets. Copy `.env.example` to `.env` (backend) or `.env.local` (admin) and fill values (e.g., database URL for TypeORM).
- Validate incoming data with DTOs and class‑validator; avoid exposing internal entities directly over HTTP.

## CI Checks
- Location: `.github/workflows/ci.yml`.
- Backend job: installs deps, runs `npm run lint`, `npm run build`, and `npm test`.
- Admin job: installs deps, runs `npm run lint` and `npm run build`.
- All PRs should pass CI before review.
