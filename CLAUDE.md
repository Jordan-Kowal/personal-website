---
alwaysApply: true
---

# Frontend Personal Website

## Project Overview

This is a **single-page application (SPA)** with no router—just one scrollable page divided into sections:

1. **Hero Banner** - Introduction/landing section
2. **Skills** - Technical skills showcase
3. **Projects** - Portfolio of work
4. **Timeline** - Career/education history
5. **Contact** - Contact information/form

Each section has its own folder in `features/` containing section-specific components, hooks, and utilities.

## Tech Stack

- **Framework**: SolidJS
- **Build**: Vite
- **Styling**: Tailwind CSS v4 + DaisyUI
- **Icons**: Lucide Solid
- **Utilities**: es-toolkit, Day.js
- **Linting/Formatting**: Biome
- **Package Manager**: pnpm

## Project Structure

```txt
src/
  assets/        # Static assets and external asset references
  components/    # Shared reusable components
    layout/      # Layout components (Hero, Section, etc.)
    ui/          # UI primitives (buttons, inputs, etc.)
  config/        # Configuration files (dayjs, daisyui, etc.)
  features/      # Feature-specific code (one folder per section)
    hero/        # Hero banner section
    skills/      # Skills section
    projects/    # Projects section
    timeline/    # Timeline section
    contact/     # Contact section
  styles/        # Global styles
  types/         # Shared type definitions
  utils/         # Shared utilities
```

## Commands

- `pnpm start` - Development server
- `pnpm build` - Production build (cleans dist first)
- `pnpm biome:check` - Check code with Biome
- `pnpm biome:check:fix` - Fix code issues with Biome
- `pnpm tsc` - TypeScript type checking
- `pnpm quality` - Run both Biome and TypeScript checks

## Code Style

### TypeScript

- Use `type` over `interface`
- Use arrow functions for pure functions
- Use descriptive names with auxiliary verbs: `isLoading`, `hasError`, `canSubmit`
- Replace magic numbers with named constants
- Always handle edge cases

### Components

- Named exports for components
- Curly braces for all conditionals
- Declarative JSX only
- No SSR/server components—this is a static frontend

### File Naming

- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utilities: `camelCase.ts`
- Types: `camelCase.ts`

### Architecture & Organization

- **Shared code** lives at root level (`components/`, `hooks/`, `utils/`, etc.)
- **Feature-specific code** stays in its feature folder with the same internal structure
- Each feature folder mirrors the root structure: `components/`, `hooks/`, `utils/`, `types/`

### Barrel Exports (index.ts)

- Use barrel `index.ts` files at every level **except** root `components/`
- For `src/components/`, skip the first level—barrel exports start **inside** `layout/` or `ui/`
  - ✅ `src/components/layout/index.tsx` exports all layout components
  - ✅ `src/components/ui/index.tsx` exports all UI components
  - ❌ No `src/components/index.tsx`
- All other directories (features, utils, types, etc.) use barrel exports at every level

## SolidJS Patterns

### Reactivity

- `createSignal` for primitive local state
- `createStore` for complex/nested objects
- `createMemo` for derived values (avoid inline computations in JSX)
- `createEffect` only for side effects, not derivations

### Control Flow

```tsx
// Conditionals - use <Show>, never ternaries for components
<Show when={isVisible()} fallback={<Placeholder />}>
  <Content />
</Show>

// Lists - use <For>, never .map()
<For each={items()}>{(item) => <Item data={item} />}</For>

// Multiple conditions - use <Switch>/<Match>
<Switch>
  <Match when={status() === 'loading'}><Spinner /></Match>
  <Match when={status() === 'error'}><Error /></Match>
  <Match when={status() === 'success'}><Content /></Match>
</Switch>
```

### Error Handling

Wrap async boundaries with `<Suspense>` and `<ErrorBoundary>`:

```tsx
<ErrorBoundary fallback={(err) => <ErrorDisplay error={err} />}>
  <Suspense fallback={<Skeleton />}>
    <AsyncContent />
  </Suspense>
</ErrorBoundary>
```

## Styling (Tailwind + DaisyUI)

- Utility-first approach
- Use DaisyUI components where applicable
- Maintain responsive design (`sm:`, `md:`, `lg:` breakpoints)
- Include accessibility attributes (`aria-*`, semantic HTML)

## Boundaries

**Always:**

- Run `/quality` after code changes
- Use SolidJS control flow (`<Show>`, `<For>`, `<Switch>`)
- Use Plan Mode for multi-file changes
- Read existing code before modifying

**Ask first:**

- Adding new dependencies
- Changing project structure
- Modifying shared components in `src/components/`
- Creating new features in `src/features/`

**Never:**

- Use `.map()` for lists or ternaries for conditionals in JSX
- Create SSR/server components
- Make changes beyond what's requested

## MCP Servers

**Context7** is available for fetching live documentation for SolidJS, DaisyUI, Tailwind, etc.
