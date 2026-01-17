# Commit Skill

Create a conventional commit for staged or all changes.

## Instructions

1. Run `git status` and `git diff` to understand current changes
2. If no changes are staged, ask the user if they want to stage all changes
3. Analyze the changes and determine the appropriate commit type:
   - `feat`: New feature
   - `fix`: Bug fix
   - `enh`: Enhancement to existing feature
   - `refactor`: Code refactoring (no functional change)
   - `style`: Formatting, styling changes
   - `docs`: Documentation only
   - `chore`: Build, config, dependencies
   - `test`: Adding or updating tests
4. Write a concise commit message following the format: `type: description`
   - Use lowercase
   - No period at the end
   - Keep under 72 characters
   - Focus on "what" and "why", not "how"
5. Show the proposed commit message and ask for confirmation
6. Execute the commit with Co-Authored-By trailer:

   ```txt
   Co-Authored-By: Claude <noreply@anthropic.com>
   ```

7. Run `git status` to confirm success
