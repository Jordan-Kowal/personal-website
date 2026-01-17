# Review Diff Skill

Review local code changes before committing.

## Instructions

1. Run `git diff` to get all unstaged changes and `git diff --cached` for staged changes
2. Analyze the changes for:
   - **Bugs**: Logic errors, off-by-one errors, null/undefined issues
   - **TypeScript**: Type safety issues, missing types, `any` usage
   - **SolidJS**: Reactivity issues, incorrect signal usage, missing cleanup
   - **Security**: XSS, injection vulnerabilities, exposed secrets
   - **Performance**: Unnecessary re-renders, missing memoization
   - **Style**: Violations of project conventions (see CLAUDE.md)
3. Provide feedback organized by severity:
   - **Critical**: Must fix before committing
   - **Warning**: Should consider fixing
   - **Suggestion**: Optional improvements
4. If no issues found, confirm the changes look good
5. Do NOT make changes unless explicitly asked
