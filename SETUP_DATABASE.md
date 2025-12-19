# Step-by-Step Database Setup Guide for Supabase

## Step 1: Create New Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click **"New Project"**
4. Fill in:
   - **Name**: Your project name (e.g., "ace-your-interview")
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier is fine for development
5. Click **"Create new project"**
6. Wait 2-3 minutes for project to initialize

## Step 2: Get Your Database Connection Info

1. In your Supabase project dashboard, click **"Settings"** (gear icon) in the left sidebar
2. Click **"API"** under Project Settings
3. Copy and save these values (you'll need them later):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (keep this secret!)

## Step 3: Run Database Migrations

### Migration 1: Base Tables (Profiles, User Progress, Skill Scores)

1. In Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Copy the ENTIRE contents of `supabase/migrations/20251213141930_cf3b4e0f-2055-4792-94a5-0ab9ad294736.sql`
4. Paste into the SQL Editor
5. Click **"Run"** (or press Cmd/Ctrl + Enter)
6. You should see: ✅ "Success. No rows returned"

### Migration 2: Question Completions Table

1. Still in SQL Editor, click **"New query"** again
2. Copy the ENTIRE contents of `supabase/migrations/20251213150000_add_question_completions.sql`
3. Paste into the SQL Editor
4. Click **"Run"**
5. You should see: ✅ "Success. No rows returned"

## Step 4: Verify Tables Were Created

1. In SQL Editor, create a new query
2. Run this to check all tables:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see:
- ✅ `profiles`
- ✅ `question_completions`
- ✅ `skill_scores`
- ✅ `user_progress`

## Step 5: Verify RLS Policies

Run this query to check RLS is enabled:
```sql
SELECT tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

You should see policies for:
- ✅ `profiles` (3 policies: SELECT, INSERT, UPDATE)
- ✅ `question_completions` (3 policies: SELECT, INSERT, UPDATE)
- ✅ `skill_scores` (3 policies: SELECT, INSERT, UPDATE)
- ✅ `user_progress` (3 policies: SELECT, INSERT, UPDATE)

## Step 6: Update Your Environment Variables

1. In your project, find `.env` or `.env.local` file
2. Update/add these variables:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Replace with your actual values from Step 2.

## Step 7: Test the Setup

1. Restart your development server
2. Open your app in the browser
3. Open browser console (F12)
4. You should see: ✅ "question_completions table exists"
5. Sign up/Log in
6. Try solving a question
7. Check console for: ✅ "Question completion saved"

## Troubleshooting

### If you see "relation does not exist" error:
- Make sure you ran BOTH migrations
- Check Step 4 to verify tables exist

### If you see RLS policy errors:
- Check Step 5 to verify policies exist
- Make sure you're logged in (auth.uid() must return a value)

### If completions aren't saving:
- Check browser console for specific error messages
- Verify you're logged in
- Check that `user_id` matches your auth user ID

## Quick Verification Query

Run this to see if everything is set up correctly:
```sql
-- Check tables
SELECT 'Tables' as check_type, COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'user_progress', 'skill_scores', 'question_completions')

UNION ALL

-- Check RLS enabled
SELECT 'RLS Enabled', COUNT(*)
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'user_progress', 'skill_scores', 'question_completions')
  AND rowsecurity = true

UNION ALL

-- Check policies
SELECT 'Policies', COUNT(*)
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'user_progress', 'skill_scores', 'question_completions');
```

Expected results:
- Tables: 4
- RLS Enabled: 4
- Policies: 12 (3 per table)

