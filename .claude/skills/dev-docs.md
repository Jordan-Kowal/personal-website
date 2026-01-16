# Dev Docs Skill

Create or update development documentation for large features/tasks to preserve context across sessions.

## Arguments

- `task`: Short task name in kebab-case (required for create)
- `action`: "create" or "update" (default: create)

## Instructions

### Creating Dev Docs (`action: create`)

1. Create the dev docs directory if it doesn't exist: `dev/active/`
2. Create three files in `dev/active/{task}/`:

**{task}-plan.md:**

```md
# {Task Name} Plan

## Overview
[Brief description of what we're building]

## Goals
- [ ] Goal 1
- [ ] Goal 2

## Approach
[High-level approach and key decisions]

## Files Involved
- `path/to/file.ts` - Description
- `path/to/file.ts` - Description

## Open Questions
- Question 1?
```

**{task}-context.md:**

```md
# {Task Name} Context

## Key Decisions
| Decision | Rationale | Date |
|----------|-----------|------|
| Decision 1 | Why we chose this | YYYY-MM-DD |

## Important Patterns
[Any patterns or conventions specific to this task]

## Dependencies
[External deps, APIs, or other features this relies on]

## Last Updated
YYYY-MM-DD HH:MM
```

**{task}-tasks.md:**

```md
# {Task Name} Tasks

## In Progress
- [ ] Current task

## Pending
- [ ] Task 1
- [ ] Task 2

## Completed
- [x] Completed task

## Blocked
[Any blocked items and why]

## Last Updated
YYYY-MM-DD HH:MM
```

3. Report the created file paths

### Updating Dev Docs (`action: update`)

1. Find existing dev docs in `dev/active/`
2. If multiple tasks exist, ask which to update
3. Update the files:
   - Mark completed tasks in `{task}-tasks.md`
   - Add any new tasks discovered
   - Update `{task}-context.md` with new decisions or context
   - Update "Last Updated" timestamps
4. If the task is complete, offer to move to `dev/completed/`

## When to Use

- Starting a new feature that spans multiple files
- Before compacting a long session
- When switching between tasks
- After making significant progress

## Tips

- Keep the plan high-level, details go in context
- Update tasks immediately when completing work
- Add decisions to context as you make them
- Reference these docs when continuing work: "Check dev/active/ for context"
