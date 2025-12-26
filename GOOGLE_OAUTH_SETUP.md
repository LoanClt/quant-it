# Google OAuth Setup Guide

This guide will help you set up Google sign-in for your application.

## Prerequisites

- A Supabase project
- A Google Cloud Console project

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - Choose **External** (unless you have a Google Workspace)
   - Fill in the required information (App name, User support email, Developer contact)
   - Add scopes: `email`, `profile`, `openid`
   - Add test users if needed (for testing before verification)
6. For **Application type**, select **Web application**
7. Add **Authorized redirect URIs**:
   - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - Replace `YOUR_PROJECT_REF` with your Supabase project reference
   - You can find this in your Supabase project URL: `https://YOUR_PROJECT_REF.supabase.co`
8. Click **Create**
9. Copy the **Client ID** and **Client Secret**

## Step 2: Configure Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find **Google** in the list and click to enable it
5. Enter your **Client ID** and **Client Secret** from Step 1
6. Click **Save**

## Step 3: Configure Redirect URLs

1. In Supabase Dashboard, go to **Authentication** → **URL Configuration**
2. Under **Redirect URLs**, add:
   - `https://your-app.vercel.app/auth/callback` (your production URL)
   - `http://localhost:5173/auth/callback` (for local development)
   - `http://localhost:3000/auth/callback` (if using port 3000)
3. Under **Site URL**, set it to your production URL: `https://your-app.vercel.app`
4. Click **Save**

## Step 4: Update Environment Variables

Make sure you have `VITE_SITE_URL` set in your Vercel environment variables:
- `VITE_SITE_URL=https://your-app.vercel.app`

This ensures OAuth redirects work correctly in production.

## Step 5: Test

1. Deploy your changes
2. Go to your auth page
3. Click "Continue with Google"
4. You should be redirected to Google's sign-in page
5. After signing in, you should be redirected back to your app

## Troubleshooting

### "OAuth provider not enabled"
- Make sure you've enabled Google in Supabase Dashboard → Authentication → Providers
- Verify the Client ID and Client Secret are correct

### Redirect URI mismatch
- Check that the redirect URI in Google Cloud Console matches: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
- Verify redirect URLs are added in Supabase → Authentication → URL Configuration

### "Invalid redirect_uri"
- Ensure your Supabase redirect URLs include `/auth/callback`
- Check that `VITE_SITE_URL` is set correctly

### Session not persisting
- Check browser console for errors
- Verify Supabase client is configured correctly
- Make sure cookies/localStorage are enabled in your browser

## Notes

- Google OAuth requires HTTPS in production (Supabase handles this)
- For local development, `http://localhost` is allowed
- The OAuth flow redirects through Supabase, which then redirects to your app
- Users signing in with Google will have their email and profile information automatically synced

