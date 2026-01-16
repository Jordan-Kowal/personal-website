---
alwaysApply: true
---

# Frontend Personal Website

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
    layout/      # Layout components (header, footer, etc.)
    ui/          # UI primitives (buttons, inputs, etc.)
  config/        # Configuration files (dayjs, daisyui, etc.)
  features/      # Feature-specific code (components, hooks, utils)
  styles/        # Global styles
  types/         # Shared type definitions
  utils/         # Shared utilities
```

If a component/hook/util is used by a single feature, keep it in that feature's folder.

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
