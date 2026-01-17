# Docs Fetcher Skill

Fetch current documentation for project dependencies using Context7 MCP.

## When to Apply

Apply this skill when:

- User asks how to do something in SolidJS
- User asks about DaisyUI components
- User asks about Tailwind CSS utilities
- User needs examples or API documentation
- Unclear about library usage patterns

## Available Documentation

Use Context7 MCP tools to fetch live documentation for:

- **SolidJS** - Reactivity, components, hooks, control flow
- **DaisyUI** - Component library built on Tailwind
- **Tailwind CSS** - Utility classes and styling
- **Day.js** - Date formatting and manipulation
- **Lucide Solid** - Icon library
- **es-toolkit** - Utility functions

## Process

### 1. Identify the Library

Determine which library documentation to fetch:

- Component/reactivity questions → SolidJS
- Styling/component questions → DaisyUI or Tailwind
- Date formatting → Day.js
- Icons → Lucide Solid
- Utility functions → es-toolkit

### 2. Resolve Library ID

Use the `resolve-library-id` MCP tool:

```txt
libraryName: "solidjs" (or "daisyui", "tailwindcss", etc.)
query: User's original question
```

### 3. Query Documentation

Use the `query-docs` MCP tool with:

```txt
libraryId: The ID from resolve-library-id
query: Specific question about the library
```

### 4. Apply to Project Context

After fetching docs:

1. Check answer against CLAUDE.md conventions
2. Ensure it follows project patterns
3. Adapt examples to project structure

**Critical checks:**

- SolidJS answers must use `<Show>`, `<For>`, `<Switch>` (never ternaries or `.map()`)
- Component examples must use named exports
- Follow project TypeScript patterns
- Match project file naming conventions

### 5. Provide Answer

Give the user:

1. Direct answer to their question
2. Code examples adapted to project style
3. References to official docs if helpful

## Common Queries

### SolidJS Questions

- "How do I create a signal?"
- "How does createMemo work?"
- "How do I handle async data?"
- "What's the difference between createEffect and createMemo?"

### DaisyUI Questions

- "What DaisyUI components are available?"
- "How do I use the DaisyUI button component?"
- "How do I customize DaisyUI themes?"

### Tailwind Questions

- "How do I make a responsive grid?"
- "What are the Tailwind breakpoints?"
- "How do I use Tailwind v4?"

## Important Notes

- **Always adapt examples** to match project conventions
- **Don't blindly copy** documentation examples
- **Verify against CLAUDE.md** before providing answers
- **Use latest docs** (Context7 provides up-to-date info)

## Example Application

**User asks:** "How do I conditionally render in SolidJS?"

**Process:**

1. Resolve library ID for SolidJS
2. Query docs with: "conditional rendering in SolidJS"
3. Get answer about `<Show>`, `<Switch>`, etc.
4. Check against CLAUDE.md → Confirms `<Show>` is correct pattern
5. Provide answer with project-style example:

```tsx
// ✅ Correct (uses <Show>)
export function MyComponent() {
  const [isVisible, setIsVisible] = createSignal(true)

  return (
    <Show when={isVisible()} fallback={<p>Hidden</p>}>
      <p>Visible content</p>
    </Show>
  )
}

// ❌ Wrong (ternaries forbidden by CLAUDE.md)
{isVisible() ? <p>Visible</p> : <p>Hidden</p>}
```

## When NOT to Use

Don't use this skill if:

- Answer is already clear in CLAUDE.md
- Question is about project-specific code (not library usage)
- User explicitly asks you NOT to fetch docs

## Tool Limits

Per Context7 guidelines:

- Maximum 3 calls to `resolve-library-id` per question
- Maximum 3 calls to `query-docs` per question
- Use best available information if limits reached
