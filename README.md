# Portfolio CMS Platform

An enterprise-level, highly scalable Portfolio CMS SaaS platform built as a monorepo.

## Architecture Diagram
(Refer to `docs/Architecture.md`)

## Project Structure
This project is built using an NPM Workspaces monorepo.

- `apps/web`: Next.js 16 (App Router) frontend
- `apps/api`: Node.js / Express backend
- `packages/ui`: Shared MUI React components
- `packages/types`: Shared TypeScript typings
- `packages/config`: Shared configurations (eslint, prettier)
- `packages/utils`: Reusable utility functions

## Getting Started

1. Ensure Node 20+ is installed.
2. Run `npm install` in the root to setup all workspaces and link local packages.
3. Copy `.env.example` to `.env` inside `apps/api` and `apps/web` where appropriate.

## Development Commands

- `npm run dev`: Start all apps locally.
- `npm run build`: Build all packages and apps.
- `npm run lint`: Run ESLint across the monorepo.
- `npm run format`: Prettier formatting.
