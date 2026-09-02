# AI Store — Engineering Guide

## Project

AI Store is a Next.js (App Router) e-commerce platform with authentication, an
admin dashboard, product/store management, public storefront, cart, checkout,
orders, and revenue tracking.

## Stack

- **Next.js 16** (App Router, `src/` directory)
- **TypeScript** (strict mode)
- **Tailwind CSS 4**
- **ESLint** (flat config, `eslint-config-next`)

## Common Commands

```bash
# Develop
npm run dev

# Build (production)
npm run build

# Start the production server
npm run start

# Lint
npm run lint

# Type-check (no emit)
npm run typecheck
```

## Project Structure

```
src/
  app/           # App Router: routes, layouts, pages, globals
  components/    # Shared/ui components (buttons, forms, layout pieces)
  hooks/         # Custom React hooks
  lib/           # Utilities, API clients, config, validation schemas
  types/         # Shared TypeScript interfaces and types
  styles/        # Global CSS, themes, design tokens
```

## Conventions

- Use the App Router exclusively (no `pages/`).
- Prefer server components by default; use `"use client"` only when client-side
  interactivity is required.
- Import via the `@/*` alias (maps to `src/*`).
- Keep feature areas isolated in their own route groups (e.g. `(auth)`,
  `(admin)`, `(store)`) as they are developed.
