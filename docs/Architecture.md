# Portfolio CMS Platform Architecture

## Overview
This document outlines the architectural decisions for the Portfolio CMS Monorepo.

## Technology Stack
- **Web Frontend**: Next.js (App Router), React, Material UI, Redux Toolkit, Framer Motion.
- **API Backend**: Node.js, Express, TypeScript, MongoDB (Mongoose), JWT Auth.
- **Monorepo**: NPM Workspaces.
- **Quality Tools**: ESLint, Prettier, Husky, lint-staged.

## Backend Architecture
Follows Clean Architecture & Domain-Driven Design principles:
- **Routes**: Define endpoints and apply middlewares.
- **Controllers**: Handle HTTP requests/responses.
- **Services**: Contain pure business logic.
- **Repositories**: Database abstractions.
- **Models**: Data schemas.

## Frontend Architecture
Follows Feature-first Architecture:
- **features/**: Reusable feature sets containing local components, hooks, api integrations.
- **components/**: Dumb, shared UI elements.
- **store/**: Global state management.
