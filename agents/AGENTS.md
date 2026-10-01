# AGENTS.md — Finance Tracker

Guidance for AI agents (and humans) working in this codebase.

## Overview

Web app for tracking group contributions and finances for a small group.

## Repo layout

Two separate GitHub repos, kept as sibling directories:

```
finance-tracker/                    # parent dir (NOT a git repo)
├── finance-tracker-frontend/       # Vite + React + TS + Tailwind + shadcn/ui + Redux
│   └── agents/                     # this file + other agentic artifacts
└── finance-tracker-backend/        # Express + TS + Prisma + Postgres
```

This `AGENTS.md` lives in the frontend repo (so it is backed up on GitHub), but
covers both repos.

## Tech stack

| Layer    | Choice                                                                      |
| -------- | --------------------------------------------------------------------------- |
| Frontend | Vite 8, React 19, TypeScript 6, Tailwind CSS v4, shadcn/ui (radix)          |
| Frontend | Redux Toolkit + react-redux, axios, react-router-dom v7, react-hot-toast    |
| Backend  | Node.js, Express 5, TypeScript 5, ESM (`"type": "module"`)                  |
| Database | PostgreSQL (local, no Docker)                                               |
| ORM      | Prisma 7 (driver adapter `@prisma/adapter-pg`)                              |
| Validation | zod (backend), used in every module's `*.dto.ts`                          |
| Auth     | JWT bearer token (localStorage), bcryptjs password hashing — implemented    |

## Prerequisites

- Node.js 24+
- Local PostgreSQL running on `localhost:5432`
- A Postgres role/database (see "Local database" below)

## Commands

### Frontend (`finance-tracker-frontend/`)

| Command                             | Purpose                                                          |
| ----------------------------------- | ---------------------------------------------------------------- |
| `npm run dev`                       | Start Vite dev server (proxies `/api` → `VITE_API_URL` or `http://localhost:4000`, strips `/api` prefix) |
| `npm run build`                     | Type-check (`tsc -b`) + production build                         |
| `npm run lint` / `lint:fix`         | eslint                                                           |
| `npm run format` / `format:check`   | prettier                                                         |
| `npm run preview`                   | Preview production build                                         |
| `npx shadcn@latest add <component>` | Add a shadcn/ui component                                        |

Note: the frontend `README.md` still describes the Vite/oxlint template — it is
stale. Linting is eslint, not oxlint.

### Backend (`finance-tracker-backend/`)

| Command                   | Purpose                                                   |
| ------------------------- | --------------------------------------------------------- |
| `npm run dev`             | Start dev server with hot reload (tsx watch) on port 4000 |
| `npm run build`           | Compile TS to `dist/`                                     |
| `npm run start`           | Run compiled output (`node dist/index.js`)                |
| `npm run typecheck`       | `tsc --noEmit`                                            |
| `npm run lint` / `lint:fix` | eslint                                                   |
| `npm run format` / `format:check` | prettier                                          |
| `npm run prisma:migrate`  | `prisma migrate dev`                                      |
| `npm run prisma:deploy`   | `prisma migrate deploy`                                   |
| `npm run prisma:generate` | `prisma generate` (required after clone — see below)      |
| `npm run prisma:seed`     | `prisma db seed`                                          |
| `npm run prisma:studio`   | `prisma studio`                                           |

## Local database & env

No Docker. Local Postgres, peer auth on the socket, `scram-sha-256` on TCP.

- Role: `victor` (superuser), password `victor`
- Database: `finance_tracker_db`

Backend `.env` (see `.env.example`):

```
DATABASE_URL="postgresql://victor:victor@localhost:5432/finance_tracker_db?schema=public"
JWT_SECRET="<generate: openssl rand -hex 32>"
```

`JWT_SECRET` is required for auth; the server returns 500 on login without it.
Frontend `.env` sets `VITE_API_URL` (leave empty to use the `/api` dev proxy).

Recreate the database if needed:

```sh
psql -d postgres -c "ALTER ROLE victor PASSWORD 'victor';"
psql -d postgres -c "CREATE DATABASE finance_tracker_db OWNER victor;"
```

## Seed data

`npm run prisma:seed` upserts 15 `Permission` rows and one admin user:

- phone `0799303355`, password `0799303355` (bcrypt, cost 10)

## Prisma 7 specifics (do NOT fight these)

- Config lives in `prisma7.config.ts` (not in the schema). It loads `DATABASE_URL`
  via `import "dotenv/config"`, and points migrations at `prisma/migrations` and
  the seed at `tsx ./prisma/seed.ts`.
- The schema (`prisma/schema.prisma`) has **no `url` in the datasource block**.
- Generator is `prisma-client` (not `prisma-client-js`), outputting TypeScript to
  `src/generated/prisma/`. **This output is gitignored** (`/src/generated/prisma`),
  so run `npm run prisma:generate` after cloning before typecheck/dev. Import it as
  `../../generated/prisma/client.js`.
- The Prisma client **requires a driver adapter**. `src/shared/db/prisma.ts`
  constructs `PrismaClient` with `@prisma/adapter-pg`; always import `prisma` from
  there, never `new PrismaClient()` inline.

## Backend architecture

- Modular by domain under `src/modules/<name>/`:
  - `*.route.ts` — Express router + `@openapi` JSDoc for Swagger
  - `*.controller.ts` — parse/validate request, call service, send response
  - `*.service.ts` — business logic, maps records → DTOs, throws `ApiError`
  - `*.repository.ts` — Prisma queries only
  - `*.dto.ts` — zod schemas + input/DTO types
- Response envelope is always `sendSuccess`/`sendFail` from
  `src/shared/http/response.ts` (`{ statusCode, status, meta, data, message }`).
- Errors: throw `ApiError(status, message)` from
  `src/shared/errors/api-error.ts`; `error.middleware.ts` handles `ApiError`,
  `ZodError`, and http errors, then 500s.
- Auth/permissions: `authMiddleware` (JWT bearer) sets `req.user`;
  `requirePermission("key")` and `requireAdmin` guard routes. Permission keys are
  string constants (see `prisma/seed.ts`).
- Entrypoint `src/index.ts` mounts routers under `/auth`, `/members`,
  `/contributions`, `/contributions/:contributionId/assignments`,
  `/recurring-contributions`, `/payments`, `/expenses`, `/stats`, `/users`,
  `/permissions`, plus `/health`.

## Swagger (backend)

- Swagger UI: `http://localhost:4000/api-docs/`
- Raw OpenAPI spec: `http://localhost:4000/api-docs.json`
- Routes are documented in-source with `@openapi` JSDoc comments (swagger-jsdoc).
  Spec definition lives in `src/shared/docs/swagger.ts`; the `apis` glob points at
  `./src/**/*.ts`.

## Conventions & guardrails

- TypeScript strict mode everywhere; do not add code comments unless asked.
- Money is `Decimal`/`Prisma.Decimal` in the DB, but **serialized as a string** in
  all DTOs and validated as a string via `moneySchema`
  (`src/shared/validation/money.ts`). Single currency (RWF) — frontend
  `formatMoney` appends `" RWF"`. Never use `Float`.
- Backend is ESM: all relative imports need the `.js` extension.
- Frontend uses the `@/` alias for `src/`, with `verbatimModuleSyntax` (use
  `import type`) and `erasableSyntaxOnly` (no enums/namespaces).
- Mobile-first design (the app is used primarily on phones).
- Touch targets: interactive elements must be ≥44px (use `h-11` buttons / `min-h-11`
  rows, not `h-7`/`text-xs` overrides). Checkboxes: `size-6` + `accent-primary`.
- Do not commit `.env`. `.env.example` documents required variables.
- `Member` (data, never logs in) and `User` (login account) are strictly separate.

## Domain concepts (non-obvious)

- **There is no `Tier` entity.** A "tier" is ephemeral — "Assign multiple" on a
  TARGETED contribution is a bulk upsert of `requiredAmount` for a set of selected
  members. Do not reintroduce a persisted/global tier model or link tiers to members.
- **Recurring contributions** are a parent `RecurringContribution` plus per-period
  `Contribution` rows (`recurringContributionId`, `recurringPeriod`). Each period is a
  normal TARGETED contribution with its **own title** (set on rollover, editable inline
  from the recurring detail page). `targetAmount` on the recurring is the **per-period**
  target (there is no grand total). `recurringPeriod` is internal ordering only — it is
  not shown as "Period N". Rollover creates the next period (requiring a title) and
  copies the latest period's assignments, skipping inactive members. `GET
  /contributions` excludes recurring periods (`recurringContributionId: null`); periods
  are only reachable inside the recurring's detail page.
- The `Outstanding` stat on a contribution = `target − disbursed` (not
  `target − collected`, since collected may legitimately exceed the target).

## Status

Fully implemented: auth, members, users, contributions, recurring contributions,
assignments, payments, expenses, permissions, stats (dashboard) on both backend
and frontend. No test suite and no CI are configured in either repo.
