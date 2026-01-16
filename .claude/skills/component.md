# Component Skill

Scaffold a new SolidJS component following project conventions.

## Arguments

- `name`: Component name in PascalCase (required)
- `location`: Where to create it - "ui", "layout", or a feature name (required)

## Instructions

1. Determine the target directory:
   - `ui` -> `src/components/ui/`
   - `layout` -> `src/components/layout/`
   - Other -> `src/features/{location}/components/`
2. Create the component file at `{directory}/{name}.tsx`
3. Use this template:

```tsx
import type { JSX } from "solid-js";

type {name}Props = {
  // Add props here
};

export const {name} = (props: {name}Props): JSX.Element => {
  return (
    <div>
      {/* Component content */}
    </div>
  );
};
```

Then:

1. Follow project conventions:
   - Named export (not default)
   - Use `type` for props, not `interface`
   - Return type `JSX.Element`
   - Arrow function syntax
2. If the feature directory doesn't exist, create it with a `components/` subfolder
3. Report the created file path
