# Quality Skill

Run all quality checks and fix issues.

## Instructions

1. Run `pnpm quality` to check for Biome and TypeScript issues
2. If there are Biome errors that can be auto-fixed:
   - Run `pnpm biome:check:fix` to auto-fix
   - Report what was fixed
3. If there are TypeScript or unfixable Biome errors:
   - List each error with file path and line number
   - Automatically fix straightforward issues (type annotations, missing imports, etc.)
   - Ask for guidance on ambiguous or complex fixes
4. Re-run `pnpm quality` to confirm all issues are resolved
5. Report final status: all checks passing or remaining issues
