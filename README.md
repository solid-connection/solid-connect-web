# 솔리드 커넥션 웹

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Clsx
- Axios
- Biome (Linter & Formatter)
- Vercel

## Prerequisites

- Node.js 22.x
- pnpm 9.x or later

## Installation

This project uses pnpm as the package manager.

```bash
# Install pnpm globally
npm install -g pnpm

# Install dependencies
pnpm install
```

## Commands

```bash
# Development server
pnpm run dev

# Build for production
pnpm run build

# Lint and auto-fix
pnpm run lint

# Lint check only (no fix)
pnpm run lint:check

# Format code
pnpm run format

# Format check only (no write)
pnpm run format:check

# Type checking
pnpm run typecheck

# Run all checks (CI)
pnpm run ci:check

# Fix all (lint + format)
pnpm run fix:all
```

## Migration from npm

If you have an existing clone:

```bash
rm -rf node_modules package-lock.json
pnpm install
```
