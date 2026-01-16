# Branch Skill

Create a new git branch or switch to an existing one.

## Arguments

- `name`: Branch name (optional - will prompt if not provided)

## Instructions

1. Run `git status` to check for uncommitted changes
2. If there are uncommitted changes, ask the user how to proceed:
   - Stash changes
   - Commit changes first
   - Abort
3. If a branch name is provided:
   - Check if branch exists locally or remotely
   - If exists, switch to it with `git checkout {name}`
   - If not, create and switch with `git checkout -b {name}`
4. If no branch name provided:
   - Show recent branches with `git branch --sort=-committerdate | head -10`
   - Ask user to pick one or provide a new name
5. Run `git status` to confirm the switch
6. Report the current branch and its tracking status
