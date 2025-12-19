# Git Commands Guide

## Basic Git Workflow

### 1. Check Status
See what files have changed:
```bash
git status
```

### 2. Stage Changes
Add files to staging area (prepare them for commit):

**Add all changed files:**
```bash
git add .
```

**Add specific file:**
```bash
git add src/index.css
```

**Add multiple specific files:**
```bash
git add src/index.css src/data/questions.ts
```

### 3. Commit Changes
Create a commit with a message:
```bash
git commit -m "Your commit message here"
```

**Good commit message examples:**
- `"Fix CSS import order issue"`
- `"Add 20 new quant interview questions"`
- `"Update Stripe integration documentation"`
- `"Fix bookmark icon styling"`

### 4. Push to GitHub
Send your commits to GitHub:
```bash
git push
```

**If it's your first push to a branch:**
```bash
git push -u origin main
```

## Complete Example

```bash
# 1. Check what changed
git status

# 2. Stage all changes
git add .

# 3. Commit with message
git commit -m "Fix CSS import order and add new questions"

# 4. Push to GitHub
git push
```

## Useful Commands

**See what changed in files:**
```bash
git diff
```

**See commit history:**
```bash
git log
```

**Undo changes to a file (before staging):**
```bash
git checkout -- filename
```

**Unstage a file (after git add):**
```bash
git reset HEAD filename
```

**Amend last commit (change the message or add more files):**
```bash
git commit --amend -m "New message"
```

**Create a new branch:**
```bash
git checkout -b feature-name
```

**Switch branches:**
```bash
git checkout main
```

## Best Practices

1. ✅ **Commit often** - Small, logical commits are better than large ones
2. ✅ **Write clear messages** - Describe what changed and why
3. ✅ **Review before committing** - Use `git diff` to see changes
4. ✅ **Don't commit sensitive data** - Check `.gitignore` includes `.env`
5. ✅ **Push regularly** - Keep your remote repository up to date

