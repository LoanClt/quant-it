# How to Find Your Supabase Keys for Vite

## What You Need (NOT a project ID)

You need **2 values**:
1. **Project URL** → `VITE_SUPABASE_URL`
2. **Anon/Public Key** → `VITE_SUPABASE_PUBLISHABLE_KEY` (also called "anon" or "public" key)

## Step-by-Step Instructions

### Step 1: Go to Supabase Dashboard
1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project (or create a new one)

### Step 2: Navigate to API Settings
1. In the left sidebar, click **"Settings"** (gear icon ⚙️)
2. Click **"API"** under "Project Settings"

### Step 3: Find Your Values

You'll see a page with several sections. Look for:

#### 📍 **Project URL** (for `VITE_SUPABASE_URL`)
- Look for the section labeled **"Project URL"** or **"API URL"**
- It looks like: `https://xxxxxxxxxxxxx.supabase.co`
- Copy this entire URL

#### 🔑 **Anon/Public Key** (for `VITE_SUPABASE_PUBLISHABLE_KEY`)
- Look for the section labeled **"Project API keys"**
- Find the key labeled **"anon"** or **"public"**
- It's a long string starting with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- Click the **eye icon** 👁️ to reveal it if it's hidden
- Click **"Copy"** to copy it

### Step 4: Add to Your .env File

1. In your project root, create or edit `.env` or `.env.local`
2. Add these lines (replace with your actual values):

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTI5ODQwMCwiZXhwIjoxOTYwODc0NDAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 5: Restart Your Dev Server

After adding the environment variables:
1. Stop your dev server (Ctrl+C)
2. Start it again: `npm run dev` or `yarn dev`
3. The new environment variables will be loaded

## Visual Guide

```
Supabase Dashboard
├── Settings (⚙️)
    └── API
        ├── Project URL: https://xxxxx.supabase.co  ← Copy this
        └── Project API keys
            ├── anon public: eyJhbGc...  ← Copy this
            └── service_role: (keep secret, don't use in frontend)
```

## Important Notes

- ✅ Use the **anon/public** key (safe for frontend)
- ❌ Never use the **service_role** key in frontend code (it's secret!)
- ✅ The Project URL is safe to expose
- ✅ Restart dev server after changing .env file

## Verify It's Working

After setting up, check your browser console when the app loads. You should see:
- ✅ No connection errors
- ✅ "question_completions table exists" (if migration was run)

## Troubleshooting

**"Invalid API key" error:**
- Make sure you copied the entire key (it's very long)
- Make sure there are no extra spaces
- Make sure you're using the **anon** key, not service_role

**"Failed to fetch" error:**
- Check your Project URL is correct
- Make sure you restarted the dev server after adding .env

