# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

B-Cube (비큐브) — official website for a subsidiary club at Ajou University's School of Business Intelligence. Full-stack Next.js 16 application with MongoDB backend, Cloudflare R2 storage, and a dark-themed glassmorphism UI in Korean.

## Commands

- `pnpm dev` — start dev server
- `pnpm build` — production build
- `pnpm lint` — run ESLint

No test framework is configured.

## Architecture

**Stack:** Next.js 16, React 19 (Server Components), TypeScript, Tailwind CSS 4, Framer Motion, Mongoose (MongoDB), Cloudflare R2 (via AWS SDK S3)

**Path alias:** `@/*` → `./src/*`

### Data Flow

Pages are Server Components that fetch data via **server actions** in `src/actions/data.ts`. These actions connect to MongoDB through `src/lib/mongodb.ts` (global connection cache). No client-side global state manager — local `useState` and a custom `useTabs` hook handle UI state.

### Routing

- `/` — Home (route group `(home)`)
- `/projects` — Project showcase with category tabs
- `/reviews` — Interviews and photo gallery
- `/recruit` — Recruitment info
- `/admin` — Admin dashboard (cookie-based auth, 7-day expiry)

### API Routes (`src/app/api/`)

RESTful CRUD for 9 resources: `activities`, `designton`, `sexyit`, `study`, `etc`, `interview`, `executives`, `photo`, `contact`. Plus `auth` (login/logout/check) and `pdf-proxy`. Each resource follows `GET/POST` at root and `GET/PUT/DELETE` at `[id]`.

### Source Organization

- `src/components/` — Reusable UI: `cards/` (ActivityCard, ProjectCard, ProfileCard), `layout/` (Navigation, Footer), `ui/` (FadeUp, Carousel, PdfModal, etc.)
- `src/features/` — Page-specific sections grouped by route: `home/`, `projects/`, `reviews/`, `recruit/`
- `src/lib/models/` — Mongoose schemas for all 9 resources + Admin
- `src/lib/mongodb.ts` — MongoDB connection with global pooling
- `src/lib/storage.ts` — R2 upload/delete helpers (`uploadImage`, `uploadPdf`)
- `src/types/index.ts` — Shared TypeScript interfaces for all models

### Client vs Server Components

Most components are Server Components by default. Client components (`"use client"`) are used for: Navigation (sidebar with Framer Motion), ProjectCard (PDF modal state), FadeUp/Carousel (animation/interaction), InteractiveCube, MouseGlow.

### Styling

Tailwind CSS 4 with custom theme in `globals.css`: primary (#14439F), accent (#7380B0), Pretendard font. Key utilities: `.glass` (glassmorphism), `.glass-hover`, `.text-gradient`. Animations: `float` (8s), `float-slow` (12s), `glow-pulse` (4s).

## Environment Variables

Required in `.env.local`:
- `MONGODB_URI` — MongoDB connection string
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PUBLIC_URL` — Cloudflare R2 credentials

## Key Patterns

- File uploads use `FormData` and go through R2 via `src/lib/storage.ts`
- Admin auth uses bcryptjs with HTTP-only secure cookies
- Remote images allowed from `*.r2.dev` and `b-cube.kr` (configured in `next.config.ts`)
- HTML lang is `ko` with Korean metadata and Naver site verification
