---
alwaysApply: true
---

# Frontend Personal Website

## Project Overview

Single-page SPA with sections: Hero, Skills, Projects, Timeline, Contact. Each section has its own folder in `features/`.

## Tech Stack

SolidJS, Vite, Tailwind CSS v4 + DaisyUI, Lucide Solid, es-toolkit, Day.js, Biome, pnpm

## Project Structure

```txt
src/
  assets/        # Static assets
  components/    # Shared components
    layout/      # Layout components (Section, Container, etc.)
    ui/          # UI primitives (Button, Input, Card, etc.)
  config/        # Configuration files
  features/      # Feature-specific code (one folder per section)
  styles/        # Global styles
  types/         # Shared types
  utils/         # Shared utilities
```

**Shared** (`src/{type}/`) — used by 2+ features
**Feature-specific** (`src/features/{name}/{type}/`) — used by single feature only

When in doubt: default to feature-specific (easier to promote later)

## Important commands

- `pnpm start` - Dev server
- `pnpm build` - Production build
- `pnpm quality` - Biome + TypeScript checks
- `pnpm biome:check:fix` - Auto-fix Biome errors

## Code Style

### File Naming

- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utilities/Types/Config: `camelCase.ts`

### Barrel Exports

Use `index.ts` at every level **except** `src/components/`:

```txt
✅ src/components/layout/index.tsx
✅ src/components/ui/index.tsx
❌ src/components/index.tsx (no root barrel)
```

### TypeScript

- Use `type` over `interface`
- Arrow functions for pure functions
- Descriptive names: `isLoading`, `hasError`, `canSubmit`
- Named constants over magic numbers
- Named exports only (no default exports)
- No SSR/server components—this is a static frontend

## Claude configuration

### MCP Servers

**Context7** - Fetch live docs for SolidJS, DaisyUI, Tailwind, etc.

### Skills

| Skill | When to use | Auto-apply |
| ------- | ------------- | ---------- |
| `solidjs-review` | Writing/reviewing components, SolidJS patterns | Yes - on any `.tsx` edit |
| `docs-fetcher` | Need library documentation | Yes - when unsure about library patterns |
| `learn` | Capture session learnings into this file | No - user-triggered only |

### Slash Commands

- `/quality` - Run quality checks and fix issues
- `/branch` - Create or switch git branches
- `/commit` - Create conventional commits
- `/review-diff` - Review local changes before committing
