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

### Barrel Exports (index.ts)

- Use `index.ts` in `src/features/*/` to export feature's public API
- Use `index.ts` in `src/components/layout/` and `src/components/ui/`
- Do NOT create `index.ts` in `src/components/` root (avoids circular imports)

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

## MCP Servers

**Context7** is available for fetching live documentation. Use it when working with library APIs that may have changed since training:

- "Using context7, show me SolidJS createResource API"
- "Using context7, how do DaisyUI 5 themes work?"

## Verification

After completing code changes, use the `quality` skill or run `pnpm quality` to ensure all checks pass.

## Session Management

**Use Plan Mode (Shift+Tab)** for:

- New features or multi-file changes
- Architectural decisions
- Unclear requirements needing exploration

**Proactively offer to:**

- Summarize completed work when context is getting long
- Verify if previous context is still needed when switching tasks
- Review what's been accomplished after major milestones

## Code Changes

- Read existing code before modifying
- Make changes file by file
- Single chunk per file—no multi-step instructions
- No whitespace-only changes
- No changes beyond what's requested
- Consider performance and security implications
