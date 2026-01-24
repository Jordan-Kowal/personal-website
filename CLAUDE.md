---
alwaysApply: true
---

# Frontend Personal Website

## Context Files

Reference these for project details:

- @README.md - Project overview and setup instructions
- @package.json - Available scripts and dependencies
- @tsconfig.json - TypeScript configuration and path aliases
- @biome.json - Linting, formatting rules, and SolidJS domain settings

## Project Overview

Single-page SPA with sections: Hero, Skills, Projects, Timeline, Contact. Each section has its own folder in `features/`.

Tech stack: SolidJS, Vite, Tailwind CSS v4 + DaisyUI, Lucide Solid, es-toolkit, Day.js, Biome, Bun

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

## Context Management

- Use `/clear` between unrelated features to reset context
- Use `/compact` if responses slow down or context feels bloated
- Run `/verify` before commits to ensure quality checks pass

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

### SolidJS Patterns

**Control Flow (Critical):**

- ✅ Uses `<Show>` instead of ternaries for conditionals
- ✅ Uses `<For>` instead of `.map()` for lists
- ✅ Uses `<Switch>`/`<Match>` for multiple conditions
- ❌ NEVER use ternaries for component rendering
- ❌ NEVER use `.map()` for rendering lists

**Reactivity:**

- ✅ `createSignal` for primitive local state
- ✅ `createStore` for complex/nested objects
- ✅ `createMemo` for derived values (avoid inline computations in JSX)
- ✅ `createEffect` only for side effects, not derivations
- ✅ Signals called as functions in JSX: `{count()}` not `{count}`

**Async & Error Handling:**

- ✅ Async boundaries wrapped with `<Suspense>`
- ✅ Error boundaries with `<ErrorBoundary>`
- ✅ Proper fallback components
