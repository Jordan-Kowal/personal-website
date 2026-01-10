---
alwaysApply: true
---

# Rules

You are an experienced fullstack developer.
You are an expert in TypeScript, Node.js, SolidJS, Vite, Tailwind + DaisyUI.

## Generic

- **Follow instructions**: All instructions within this document must be followed, these are not optional unless explicitly stated.
- **Ask for clarification**: Ask for clarification If you are uncertain of any of thing within the document.
- **Be succinct**: Do not waste tokens, be succinct and concise.
- **Verify Information**: Always verify information before presenting it. Do not make assumptions or speculate without clear evidence.
- **No Apologies**: Never use apologies.
- **No Understanding Feedback**: Avoid giving feedback about understanding in comments or documentation.
- **No Unnecessary Confirmations**: Don't ask for confirmation of information already provided in the context.
- **No Implementation Checks**: Don't ask the user to verify implementations that are visible in the provided context.
- **Provide Real File Links**: Always provide links to the real files, not the context generated file.
-. **No Current Implementation**: Don't show or discuss the current implementation unless specifically requested.
-. **Check Context Generated File Content**: Remember to check the context generated file for the current file contents and implementations
-. **No Summaries**: Don't summarize changes made.

## Code change

- **No fluff**: Do not edit more code than you have to.
- **File-by-File Changes**: Make changes file by file and give me a chance to spot mistakes.
- **No Whitespace Suggestions**: Don't suggest whitespace changes.
- **Single Chunk Edits**: Provide all edits in a single chunk instead of multiple-step instructions or explanations for the same file.
- **No Unnecessary Updates**: Don't suggest updates or changes to files when there are no actual modifications needed.
- **Use Explicit Variable Names**: Prefer descriptive, explicit variable names over short, ambiguous ones to enhance code readability.
- **Follow Consistent Coding Style**: Adhere to the existing coding style in the project for consistency.
- **Prioritize Performance**: When suggesting changes, consider and prioritize code performance where applicable.
- **Security-First Approach**: Always consider security implications when modifying or suggesting code changes.
-. **Test Coverage**: Suggest or include appropriate unit tests for new or modified code.
-. **Error Handling**: Implement robust error handling and logging where necessary.
-. **Avoid Magic Numbers**: Replace hardcoded values with named constants to improve code clarity and maintainability.
-. **Consider Edge Cases**: When implementing logic, always consider and handle potential edge cases.
-. **Use Assertions**: Include assertions wherever possible to validate assumptions and catch potential errors early.
-. **Use Route Constants**: Never hardcode route paths as strings. Always use the `routePaths` constant from the centralized routing configuration.

## Frontend Key Principles

- Write concise, technical TypeScript code with accurate examples.
- Use functional and declarative programming patterns; avoid classes.
- Prefer iteration and modularization over code duplication.
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError).
- Follow the existing project structure. If a component/hook/... is used by a single feature, it should be in its folder.
- Do not use SSR and Server-side components. This is a static frontend with no server-side.

### Syntax and Formatting

- Use TypeScript for all code and prefer types to interfaces.
- Always use named exports for components, except for page components.
- Use the arrow functions for pure functions.
- Use curly braces for all conditionals. Favor simplicity over cleverness.
- Use declarative JSX.

### UI and Styling

- Use DaisyUI and Tailwind CSS for styling components, following a utility-first approach.
- Leverage daisyUI's pre-built components for quick UI development.
- Follow a consistent design language using Tailwind CSS classes and daisyUI themes.
- Ensure the design remains responsive.
- Optimize for accessibility (e.g., aria-attributes) when using components.

### Package Manager & Commands

- **Package Manager**: Use `pnpm` for all package management tasks (install, add, remove, etc.)
- **Commands**: Always lookup available commands in `package.json` scripts section before running any command

### Dependencies

- Vite (for building)
- Biome (for linting and formatting)
- SolidJS (main framework)
- SolidJS Router (for routing)
- DaisyUI + Tailwind (for styling)
- Solid Query (for data fetching)
- Dayjs (for dates)
