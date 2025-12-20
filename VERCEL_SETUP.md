# Vercel Deployment Setup

## Required Environment Variables

For your app to work on Vercel, you need to set the following environment variables in your Vercel project settings:

### 1. Go to Vercel Dashboard
1. Navigate to your project on [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to **Settings** → **Environment Variables**

### 2. Add Supabase Environment Variables

Add these three variables:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
VITE_SITE_URL=https://your-app.vercel.app
```

**Important:** 
- Replace `https://your-app.vercel.app` with your actual Vercel deployment URL (e.g., `https://quantit.vercel.app`)
- **This is REQUIRED** - Without `VITE_SITE_URL`, email verification links will redirect to localhost even when users sign up from production
- Make sure to add this for **Production** environment (and optionally Preview/Development)
- After adding, you **must redeploy** for it to take effect

**Where to find these values:**
- Go to your [Supabase Dashboard](https://supabase.com/dashboard)
- Select your project
- Go to **Settings** → **API**
- Copy the **Project URL** → This is your `VITE_SUPABASE_URL`
- Copy the **anon/public** key → This is your `VITE_SUPABASE_PUBLISHABLE_KEY`

### 3. Optional: Stripe Variables (if using payments)

```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_PRICE_ID=price_...
```

### 4. Redeploy

After adding the environment variables:
1. Go to **Deployments** tab
2. Click the **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger a new deployment

## Important Notes

- Environment variables are case-sensitive
- Make sure to add them for **Production**, **Preview**, and **Development** environments (or at least Production)
- After adding variables, you **must redeploy** for them to take effect
- The `VITE_` prefix is required for Vite to expose these variables to the client-side code

## Step 5: Configure Supabase Redirect URLs

**CRITICAL:** You must configure Supabase to allow your Vercel URL, otherwise email verification will fail:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **URL Configuration** (or **Settings** → **Auth** → **URL Configuration**)
4. Under **Redirect URLs**, add your Vercel URL:
   - `https://your-app.vercel.app/**` (allows all paths)
   - `https://your-app.vercel.app` (root path)
5. Under **Site URL**, set it to: `https://your-app.vercel.app`
6. **Important:** Also add `http://localhost:3000/**` and `http://localhost:5173/**` if you want to test locally
7. Click **Save**

**Why this matters:** Even if you set `VITE_SITE_URL` correctly, Supabase will reject redirect URLs that aren't in this allowlist. This is a security feature.

## Troubleshooting

### "load failed" error when logging in
- ✅ Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are set in Vercel
- ✅ Verify the values are correct (no extra spaces, correct format)
- ✅ Make sure you've redeployed after adding the variables

### Email verification redirects to localhost
- ✅ **Set `VITE_SITE_URL` environment variable in Vercel** to your production URL (e.g., `https://your-app.vercel.app`)
- ✅ **Configure Supabase redirect URLs** (see Step 5 above) - This is REQUIRED
- ✅ **Redeploy your Vercel app** after adding the variable
- ✅ **Test by signing up from your production site** (not localhost) - if you sign up from localhost, the email will have localhost in the URL
- ✅ If you already signed up from localhost, you'll need to sign up again from production after fixing the configuration

### Blank page on Vercel
- ✅ Check browser console for errors
- ✅ Verify the build completed successfully
- ✅ Check that `vercel.json` is in your project root (for SPA routing)
