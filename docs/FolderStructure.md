# Folder Structure Guide

## Root Monorepo
- `/apps`: Contains the main deployable applications (`web`, `api`).
- `/packages`: Contains internal shared libraries.
- `/docs`: Global project documentation.

## Apps Web (Next.js)
- `app/`: Next.js App Router root.
- `components/`: Global components.
- `features/`: Feature-sliced design implementation.
- `store/`: Redux configuration.
- `providers/`: Theme and state providers.

## Apps API (Express)
- `src/controllers`: Request handlers.
- `src/services`: Business logic.
- `src/repositories`: Database access.
- `src/routes`: Express routers.
- `src/models`: Mongoose models.
