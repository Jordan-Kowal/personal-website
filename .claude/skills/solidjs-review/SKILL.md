# SolidJS Review Skill

Automatically review SolidJS code for project-specific patterns and conventions.

## When to Apply

Apply this skill when:

- Reviewing or writing any `.tsx` component file
- User asks for code review
- Making changes to existing SolidJS components

## Review Checklist

### Control Flow (Critical)

- ✅ Uses `<Show>` instead of ternaries for conditionals
- ✅ Uses `<For>` instead of `.map()` for lists
- ✅ Uses `<Switch>`/`<Match>` for multiple conditions
- ❌ NEVER use ternaries for component rendering
- ❌ NEVER use `.map()` for rendering lists

### Component Structure

- ✅ Named exports (no default exports)
- ✅ Curly braces on all conditionals
- ✅ PascalCase file naming
- ✅ Declarative JSX only

### Reactivity

- ✅ `createSignal` for primitive local state
- ✅ `createStore` for complex/nested objects
- ✅ `createMemo` for derived values (avoid inline computations in JSX)
- ✅ `createEffect` only for side effects, not derivations
- ✅ Signals called as functions in JSX: `{count()}` not `{count}`

### Async & Error Handling

- ✅ Async boundaries wrapped with `<Suspense>`
- ✅ Error boundaries with `<ErrorBoundary>`
- ✅ Proper fallback components

### TypeScript

- ✅ Use `type` over `interface`
- ✅ Descriptive names with auxiliary verbs: `isLoading`, `hasError`, `canSubmit`
- ✅ No magic numbers (use named constants)
- ✅ Handle edge cases

### Styling

- ✅ Tailwind utility-first approach
- ✅ DaisyUI components where applicable
- ✅ Responsive design (`sm:`, `md:`, `lg:`)
- ✅ Accessibility attributes (`aria-*`, semantic HTML)

## Critical Violations (Must Fix)

1. **Ternaries for components** - Replace with `<Show>`
2. **`.map()` for lists** - Replace with `<For>`
3. **Missing signal calls** - Signals must be called: `count()` not `count`
4. **Default exports** - Use named exports only

## Warnings (Should Fix)

1. Inline computations in JSX (use `createMemo`)
2. Missing TypeScript types
3. Missing accessibility attributes
4. Unnecessary `createEffect` (use `createMemo` for derivations)

## Review Process

1. Check all control flow patterns first (most critical)
2. Verify reactivity usage
3. Check component structure and naming
4. Verify TypeScript usage
5. Check styling and accessibility
6. Provide feedback organized by severity
7. Do NOT make changes unless explicitly asked
