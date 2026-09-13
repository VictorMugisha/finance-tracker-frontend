# AGENTS.md — Finance Tracker

Guidance for AI agents (and humans) working in this codebase.

## Overview

Web app for tracking group contributions and finances for a small group. Full
requirements live in the parent directory:

- `../finance-tracker-requirements.md` (authoritative spec — read it first)

## Repo layout

Two separate GitHub repos, kept as sibling directories:

```
finance-tracker/                    # parent dir (NOT a git repo)
├── finance-tracker-requirements.md
├── finance-tracker-frontend/       # Vite + React + TS + Tailwind + shadcn/ui
│   └── agents/                     # this file + other agentic artifacts
└── finance-tracker-backend/        # Express + TS + Prisma + Postgres
```

This `AGENTS.md` lives in the frontend repo (so it is backed up on GitHub), but
covers both repos.

## Tech stack

| Layer    | Choice                                                             |
| -------- | ------------------------------------------------------------------ |
| Frontend | Vite 8, React 19, TypeScript 6, Tailwind CSS v4, shadcn/ui (radix) |
| Backend  | Node.js, Express 5, TypeScript 5, ESM (`"type": "module"`)         |
| Database | PostgreSQL (local, no Docker)                                      |
| ORM      | Prisma 7 (driver adapter `@prisma/adapter-pg`)                     |
| Auth     | JWT bearer token (localStorage) — not yet implemented              |

## Prerequisites

- Node.js 24+
- Local PostgreSQL 18 running on `localhost:5432`
- A Postgres role/database (see "Local database" below)

## Commands

### Frontend (`finance-tracker-frontend/`)

| Command                             | Purpose                                                          |
| ----------------------------------- | ---------------------------------------------------------------- |
| `npm run dev`                       | Start Vite dev server (proxies `/api` → `http://localhost:4000`) |
| `npm run build`                     | Type-check (`tsc -b`) + production build                         |
| `npm run lint`                      | oxlint                                                           |
| `npm run preview`                   | Preview production build                                         |
| `npx shadcn@latest add <component>` | Add a shadcn/ui component                                        |

### Backend (`finance-tracker-backend/`)

| Command                   | Purpose                                                   |
| ------------------------- | --------------------------------------------------------- |
| `npm run dev`             | Start dev server with hot reload (tsx watch) on port 4000 |
| `npm run build`           | Compile TS to `dist/`                                     |
| `npm run start`           | Run compiled output (`node dist/index.js`)                |
| `npm run typecheck`       | `tsc --noEmit`                                            |
| `npm run prisma:migrate`  | `prisma migrate dev`                                      |
| `npm run prisma:generate` | `prisma generate`                                         |
| `npm run prisma:seed`     | `prisma db seed`                                          |
| `npm run prisma:studio`   | `prisma studio`                                           |

## Local database

No Docker. Local Postgres, peer auth on the socket, `scram-sha-256` on TCP.

- Role: `victor` (superuser), password `victor`
- Database: `finance_tracker_db`

Connection string (in `finance-tracker-backend/.env`):

```
DATABASE_URL="postgresql://victor:victor@localhost:5432/finance_tracker_db?schema=public"
```

Recreate the database if needed:

```sh
psql -d postgres -c "ALTER ROLE victor PASSWORD 'victor';"
psql -d postgres -c "CREATE DATABASE finance_tracker_db OWNER victor;"
```

## Prisma 7 specifics (do NOT fight these)

- Config lives in `prisma7.config.ts` (not in the schema). It loads
  `DATABASE_URL` via `import "dotenv/config"`.
- The schema (`prisma/schema.prisma`) has **no `url` in the datasource block**.
- Generator is `prisma-client` (not `prisma-client-js`), outputting TypeScript
  to `src/generated/prisma/`. Import it as
  `../generated/prisma/client.js` (the generated code is committed/generated
  via `npm run prisma:generate`).
- The Prisma client **requires a driver adapter**. `src/lib/prisma.ts` uses
  `@prisma/adapter-pg` (pg). Always construct `PrismaClient` with the adapter.

## Conventions & guardrails

- TypeScript strict mode everywhere; do not add code comments unless asked.
- Money is always `Decimal`/`Prisma.Decimal` — never `Float`. Single currency.
- Mobile-first design (the app is used primarily on phones).
- Auth = JWT bearer token; do not store secrets/tokens in the repo.
- Do not commit `.env`. `.env.example` documents required variables.
- `Member` (data, never logs in) and `User` (login account) are strictly
  separate — see requirements §3.1.

## Swagger (backend)

- Swagger UI: `http://localhost:4000/api-docs/`
- Raw OpenAPI spec: `http://localhost:4000/api-docs.json`
- Routes are documented in-source with `@openapi` JSDoc comments
  (swagger-jsdoc). Spec definition lives in `src/swagger.ts`; the `apis`
  glob points at `./src/**/*.ts`.

## Status

Scaffold only. Feature work (Prisma data model, seed, auth, and all modules)
has not been started. The backend has a single `/health` endpoint (documented
via Swagger) verifying DB connectivity; the frontend is a minimal shadcn/ui
shell.
