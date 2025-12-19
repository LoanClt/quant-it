# How to Push to GitHub

## Step 1: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in:
   - **Repository name**: `ace-your-interview` (or your preferred name)
   - **Description**: "Quant interview practice platform"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**

## Step 2: Add Remote and Push

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add your GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ace-your-interview.git

# Or if you prefer SSH (if you have SSH keys set up):
# git remote add origin git@github.com:YOUR_USERNAME/ace-your-interview.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Alternative: Using GitHub CLI

If you have GitHub CLI installed:

```bash
# Install GitHub CLI (if not installed)
brew install gh

# Authenticate
gh auth login

# Create repository and push in one command
gh repo create ace-your-interview --public --source=. --remote=origin --push
```

## Step 3: Verify

1. Go to your GitHub repository page
2. You should see all your files there
3. Make sure `.env` is NOT in the repository (it's in .gitignore)

## Future Updates

After making changes, push updates with:

```bash
# Stage all changes
git add .

# Commit with a message
git commit -m "Description of your changes"

# Push to GitHub
git push
```

## Important Notes

⚠️ **Before pushing, make sure:**
- ✅ `.env` file is in `.gitignore` (it is!)
- ✅ No sensitive keys are hardcoded in files
- ✅ `node_modules` is ignored (it is!)

🔒 **Secrets to keep private:**
- Stripe secret keys
- Supabase service role keys
- Database passwords
- Any API keys

These should only be in `.env` (which is gitignored) or in environment variables on your hosting platform.

