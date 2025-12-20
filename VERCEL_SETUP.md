# Vercel Deployment Setup

## Required Environment Variables

For your app to work on Vercel, you need to set the following environment variables in your Vercel project settings:

### 1. Go to Vercel Dashboard
1. Navigate to your project on [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to **Settings** → **Environment Variables**

### 2. Add Supabase Environment Variables

Add these two variables:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
```

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

## Troubleshooting

### "load failed" error when logging in
- ✅ Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are set in Vercel
- ✅ Verify the values are correct (no extra spaces, correct format)
- ✅ Make sure you've redeployed after adding the variables

### Blank page on Vercel
- ✅ Check browser console for errors
- ✅ Verify the build completed successfully
- ✅ Check that `vercel.json` is in your project root (for SPA routing)
