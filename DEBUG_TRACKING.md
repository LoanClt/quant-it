# Debug Question Tracking

## Steps to Debug:

1. **Open Browser Console** (F12 → Console tab)

2. **Check for these messages when you solve a question:**
   - ✅ "Question completion saved: { questionId, isCorrect, timeTaken, data }"
   - ❌ "Error saving question completion to database: [error details]"
   - ❌ "The question_completions table does not exist. Please run the migration."

3. **Verify Migration Was Run:**
   - Go to Supabase Dashboard → SQL Editor
   - Run this query to check if table exists:
   ```sql
   SELECT EXISTS (
     SELECT FROM information_schema.tables 
     WHERE table_schema = 'public' 
     AND table_name = 'question_completions'
   );
   ```
   - Should return `true`

4. **If table doesn't exist, run the migration:**
   - Copy contents of `supabase/migrations/20251213150000_add_question_completions.sql`
   - Paste in Supabase SQL Editor
   - Click "Run"

5. **Check RLS Policies:**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'question_completions';
   ```
   - Should show 3 policies (SELECT, INSERT, UPDATE)

6. **Test Direct Insert:**
   ```sql
   INSERT INTO question_completions (user_id, question_id, is_correct, time_taken)
   VALUES ('YOUR_USER_ID', 'q1', true, 60);
   ```
   - Replace YOUR_USER_ID with your actual user ID from auth.users

## Common Issues:

1. **Table doesn't exist** → Run migration
2. **RLS blocking** → Check policies are correct
3. **User not authenticated** → Check if user is logged in
4. **Wrong user_id** → Verify auth.uid() matches

