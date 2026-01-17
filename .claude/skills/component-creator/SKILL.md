# Component Creator Skill

Create new SolidJS components following project structure and conventions.

## When to Apply

Apply this skill when:

- User asks to create a new component
- User requests a new UI element
- Adding components during feature development

## Decision Process

### 1. Determine Location

Ask yourself: **Is this component shared or feature-specific?**

#### Shared Components

Used by 2+ features → `src/components/`

- **Layout components** → `src/components/layout/`
  - Examples: Section, Container, Grid, Hero, Footer
- **UI primitives** → `src/components/ui/`
  - Examples: Button, Input, Card, Modal, Badge

#### Feature-Specific Components

Used by single feature → `src/features/{feature}/components/`

- Examples: `src/features/hero/components/HeroBanner.tsx`
- Examples: `src/features/projects/components/ProjectCard.tsx`

### 2. Confirm with User

**IMPORTANT**: If location is ambiguous, ask the user before creating:

- "This component will be used in [feature]. Should it go in `src/features/{feature}/components/` or is it shared?"
- "I'm placing this in `src/components/ui/` since it's a reusable primitive. Confirm?"

### 3. File Naming Rules

- Components: `PascalCase.tsx`
- Example: `ProjectCard.tsx`, `HeroBanner.tsx`, `Button.tsx`

### 4. Component Template

```tsx
export function ComponentName() {
  return (
    <div>
      {/* Content */}
    </div>
  )
}
```

**Key requirements:**

- ✅ Named export (never default)
- ✅ Arrow function or function declaration
- ✅ Return JSX

### 5. Update Barrel Exports

Add the new component to the appropriate `index.tsx`:

#### For `src/components/layout/` or `src/components/ui/`

Update the barrel export inside that folder:

```typescript
// src/components/layout/index.tsx
export { Section } from './Section'
export { Container } from './Container'
export { NewComponent } from './NewComponent' // Add this
```

#### For feature components

Update the barrel export in the feature folder:

```typescript
// src/features/projects/components/index.tsx
export { ProjectCard } from './ProjectCard'
export { NewComponent } from './NewComponent' // Add this
```

**IMPORTANT**: Never create `src/components/index.tsx` (root components folder has no barrel)

### 6. SolidJS Patterns to Follow

When creating the component, ensure:

- Use `<Show>` for conditionals (never ternaries)
- Use `<For>` for lists (never `.map()`)
- Use `<Switch>`/`<Match>` for multiple conditions
- Named exports only
- Curly braces on all conditionals

### 7. TypeScript

- Define prop types inline or as a separate `type`
- Use `type` over `interface`
- Example:

  ```tsx
  type ButtonProps = {
    label: string
    onClick: () => void
  }

  export function Button(props: ButtonProps) {
    return <button onClick={props.onClick}>{props.label}</button>
  }
  ```

## Boundaries

**Ask before creating:**

- Components in `src/components/` (shared components require approval per CLAUDE.md)
- New feature folders in `src/features/`

**Always:**

- Read existing components first to match patterns
- Update barrel exports
- Follow naming conventions
- Use named exports

**Never:**

- Create components without confirming location if ambiguous
- Use default exports
- Skip barrel export updates
- Use `.map()` or ternaries in JSX
