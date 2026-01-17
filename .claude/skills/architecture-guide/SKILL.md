# Architecture Guide Skill

Enforce project structure and file organization rules.

## When to Apply

Apply this skill when:

- Creating new files or folders
- Suggesting refactors or reorganization
- Moving code between locations
- User asks where something should go

## Project Structure Rules

### Root Structure

```txt
src/
  assets/        # Static assets and external asset references
  components/    # Shared reusable components
    layout/      # Layout components (Hero, Section, etc.)
    ui/          # UI primitives (buttons, inputs, etc.)
  config/        # Configuration files (dayjs, daisyui, etc.)
  features/      # Feature-specific code (one folder per section)
  styles/        # Global styles
  types/         # Shared type definitions
  utils/         # Shared utilities
```

### Shared vs Feature-Specific Decision

**Shared** (root level: `src/{type}/`)

- Used by 2+ features
- Generic, reusable across contexts
- Examples: Button, formatDate, User type

**Feature-Specific** (`src/features/{name}/{type}/`)

- Used by single feature only
- Domain-specific to that section
- Examples: ProjectCard (projects only), TimelineEvent (timeline only)

**When in doubt**: Ask the user or default to feature-specific (easier to promote to shared later)

## File Organization by Type

### Components (`components/`)

**Shared components:**

- `src/components/layout/` - Layout components
  - Section, Container, Grid, Hero, Footer
- `src/components/ui/` - UI primitives
  - Button, Input, Card, Modal, Badge, Icon

**Feature components:**

- `src/features/{feature}/components/`
  - Feature-specific components only

### Hooks

**Shared:** `src/hooks/`
**Feature-specific:** `src/features/{feature}/hooks/`

### Utils

**Shared:** `src/utils/`
**Feature-specific:** `src/features/{feature}/utils/`

### Types

**Shared:** `src/types/`
**Feature-specific:** `src/features/{feature}/types/`

### Config

**Always shared:** `src/config/`

- Configuration files only (dayjs, daisyui, etc.)

### Styles

**Always shared:** `src/styles/`

- Global styles only

### Assets

**Always shared:** `src/assets/`

- Static assets (images, videos, fonts, etc.)

## Barrel Exports Rules

**Critical exception for `src/components/`:**

```
✅ src/components/layout/index.tsx    (barrel inside layout/)
✅ src/components/ui/index.tsx        (barrel inside ui/)
❌ src/components/index.tsx           (NO barrel at root components/)
```

**All other directories use barrel exports at every level:**

```txt
✅ src/utils/index.ts
✅ src/types/index.ts
✅ src/hooks/index.ts
✅ src/features/projects/index.tsx
✅ src/features/projects/components/index.tsx
✅ src/features/projects/hooks/index.ts
```

### Barrel Export Template

```typescript
// index.tsx or index.ts
export { ComponentName } from './ComponentName'
export { AnotherComponent } from './AnotherComponent'
```

## File Naming Conventions

- **Components:** `PascalCase.tsx`
- **Hooks:** `useCamelCase.ts`
- **Utilities:** `camelCase.ts`
- **Types:** `camelCase.ts`
- **Config:** `camelCase.ts`

## Feature Folder Structure

Each feature mirrors root structure:

```txt
src/features/{feature}/
  components/      # Feature-specific components
    index.tsx      # Barrel export
  hooks/           # Feature-specific hooks (optional)
    index.ts       # Barrel export
  utils/           # Feature-specific utilities (optional)
    index.ts       # Barrel export
  types/           # Feature-specific types (optional)
    index.ts       # Barrel export
  index.tsx        # Feature barrel export
```

## Boundaries

### Ask Before

- Adding files to `src/components/` (shared components require approval)
- Creating new features in `src/features/`
- Changing project structure
- Moving files between shared and feature-specific

### Always

- Maintain structure consistency
- Update barrel exports when adding files
- Follow file naming conventions
- Keep shared code truly shared (2+ features)

### Never

- Create `src/components/index.tsx` (root components barrel)
- Mix feature-specific code in shared folders
- Skip barrel export updates
- Break naming conventions

## Decision Flowchart

1. **Is it a component?**
   - Yes → Is it used by 2+ features?
     - Yes → `src/components/layout/` or `src/components/ui/` (ask user first per boundaries)
     - No → `src/features/{feature}/components/`
   - No → Continue to step 2

2. **Is it a hook?**
   - Yes → Is it used by 2+ features?
     - Yes → `src/hooks/`
     - No → `src/features/{feature}/hooks/`
   - No → Continue to step 3

3. **Is it a utility?**
   - Yes → Is it used by 2+ features?
     - Yes → `src/utils/`
     - No → `src/features/{feature}/utils/`
   - No → Continue to step 4

4. **Is it a type?**
   - Yes → Is it used by 2+ features?
     - Yes → `src/types/`
     - No → `src/features/{feature}/types/`
   - No → Continue to step 5

5. **Is it config, styles, or assets?**
   - Config → `src/config/`
   - Styles → `src/styles/`
   - Assets → `src/assets/`

## When Applied

This skill should automatically guide:

- File creation and placement
- Refactoring and reorganization
- Barrel export management
- Structure consistency enforcement
