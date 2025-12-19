# Stripe Integration Setup Guide

This guide will walk you through setting up Stripe payments for your application.

## Prerequisites

- A Stripe account (sign up at https://stripe.com)
- Your Supabase project set up and running
- Node.js installed

## Step 1: Get Your Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Make sure you're in **Test Mode** (toggle in top right)
3. Click **"Developers"** → **"API keys"**
4. Copy these keys (you'll need them):
   - **Publishable key**: `pk_test_...` (safe for frontend)
   - **Secret key**: `sk_test_...` (keep secret, use in backend only)

## Step 2: Create a Stripe Product and Price

1. In Stripe Dashboard, go to **"Products"** → **"Add product"**
2. Fill in:
   - **Name**: "Premium Subscription"
   - **Description**: "Access to all questions, hints, and support"
   - **Pricing**: 
     - **Price**: $5.00
     - **Billing period**: Monthly (recurring)
3. Click **"Save product"**
4. Copy the **Price ID** (looks like `price_xxxxx`) - you'll need this

## Step 3: Update Database Schema

Run this migration in your Supabase SQL Editor to add Stripe fields:

```sql
-- Add Stripe fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON public.profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_subscription ON public.profiles(stripe_subscription_id);
```

## Step 4: Set Up Environment Variables

1. Create a `.env` file in your project root (if it doesn't exist)
2. Add your Stripe keys:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PRICE_ID=price_your_price_id_here
```

**Important:**
- The `VITE_` prefix makes the key available in the frontend
- Never commit `.env` to git (it should be in `.gitignore`)
- Use test keys for development, production keys for production

## Step 5: Install Stripe Dependencies

Run this command in your terminal:

```bash
npm install @stripe/stripe-js
```

## Step 6: Set Up Supabase Edge Function for Webhooks

Stripe needs a webhook endpoint to notify your app when subscriptions change. We'll use Supabase Edge Functions.

### 6.1: Install Supabase CLI

**Option A: Using Homebrew (macOS - Recommended)**
```bash
brew tap supabase/tap
brew install supabase
```

**Option B: Using npm (if you have proper permissions)**
```bash
npm install -g supabase
```

**If you get permission errors with npm, use one of these:**
- **Use Homebrew instead** (Option A - recommended for macOS)
- **Use sudo** (not recommended): `sudo npm install -g supabase`
- **Fix npm permissions** (better long-term):
  ```bash
  mkdir ~/.npm-global
  npm config set prefix '~/.npm-global'
  echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
  source ~/.zshrc
  npm install -g supabase
  ```

**Option C: Using Scoop (Windows)**
```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Option D: Use npx (no installation needed)**
You can use Supabase CLI without installing it globally:
```bash
npx supabase@latest --version
npx supabase@latest link --project-ref your-project-ref-id
npx supabase@latest functions deploy stripe-webhook
```

**Verify installation:**
```bash
supabase --version
```

### 6.2: Link to Your Supabase Project

1. Get your project reference ID from Supabase Dashboard → Settings → General → Reference ID
2. Link your local project:

```bash
cd /path/to/your/project
supabase link --project-ref your-project-ref-id
```

You'll be prompted to enter your database password.

### 6.3: Verify Functions Exist

The Edge Functions are already created in your project:
- `supabase/functions/create-checkout-session/index.ts`
- `supabase/functions/stripe-webhook/index.ts`
- `supabase/functions/create-portal-session/index.ts`

If they don't exist, you can create them:
```bash
supabase functions new create-checkout-session
supabase functions new stripe-webhook
supabase functions new create-portal-session
```

Then copy the code from the files created earlier.

### 6.4: Set Environment Secrets

Before deploying, set your Stripe secrets:

```bash
# Set Stripe secret key
supabase secrets set STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Set Stripe price ID (optional, can also use env var)
supabase secrets set STRIPE_PRICE_ID=price_your_price_id_here
```

**Note:** You'll set the webhook secret after creating the webhook endpoint in Stripe.

### 6.5: Deploy the Functions

Deploy all three functions:

```bash
# Deploy checkout session function
supabase functions deploy create-checkout-session

# Deploy webhook function
supabase functions deploy stripe-webhook

# Deploy portal session function
supabase functions deploy create-portal-session
```

### 6.6: Get Your Webhook URL

After deployment, your webhook URL will be:
```
https://your-project-ref.supabase.co/functions/v1/stripe-webhook
```

Replace `your-project-ref` with your actual Supabase project reference ID.

**Alternative: Find it in Supabase Dashboard**
1. Go to Supabase Dashboard → Edge Functions
2. Click on `stripe-webhook`
3. Copy the function URL

## Step 7: Configure Stripe Webhook

1. In Stripe Dashboard, go to **"Developers"** → **"Webhooks"**
2. Click **"Add endpoint"**
3. Enter your webhook URL: `https://your-project-ref.supabase.co/functions/v1/stripe-webhook`
   - Replace `your-project-ref` with your actual Supabase project reference ID
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **"Add endpoint"**
6. Copy the **Webhook signing secret** (starts with `whsec_...`) - you'll need this

## Step 8: Add Webhook Secret to Supabase

**Option A: Using CLI (Recommended)**
```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
```

**Option B: Using Supabase Dashboard**
1. In Supabase Dashboard, go to **"Project Settings"** → **"Edge Functions"**
2. Click **"Manage secrets"**
3. Add a secret:
   - **Name**: `STRIPE_WEBHOOK_SECRET`
   - **Value**: Your webhook signing secret (`whsec_...`)
4. Click **"Save"**

**Verify secrets are set:**
```bash
supabase secrets list
```

You should see:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_ID` (if you set it)

## Step 9: Update Your Code

The code has been updated with:
- ✅ Stripe checkout integration in `src/hooks/useStripe.ts`
- ✅ Updated Pricing page with checkout button
- ✅ Updated subscription hook to check Stripe status
- ✅ Webhook handler for subscription events

## Step 10: Test the Integration

### Test Mode

1. Use Stripe test cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Use any future expiry date, any CVC, any ZIP

2. Test the flow:
   - Click "Upgrade to Premium" on pricing page
   - Complete checkout with test card
   - Check that `is_paid` is set to `true` in database
   - Verify premium questions are unlocked

### Production Mode

1. Switch Stripe Dashboard to **Live Mode**
2. Update environment variables with production keys
3. Update webhook endpoint to production URL
4. Test with real card (use a small amount first!)

## Troubleshooting

### CLI Installation Issues

**"command not found: supabase"**
- Make sure npm global bin is in your PATH
- Try: `npm config get prefix` and add that path to your PATH
- Or use Homebrew/Scoop installation methods above
- Restart your terminal after installation

**"Permission denied" when installing globally**
- Use `sudo npm install -g supabase` (macOS/Linux)
- Or configure npm to use a different directory: `npm config set prefix ~/.npm-global`

### Linking Issues

**"Error linking project"**
- Make sure you're using the correct project reference ID
- Check that you have access to the Supabase project
- Try logging in first: `supabase login`

**"Database password incorrect"**
- Get your database password from Supabase Dashboard → Settings → Database
- Or reset it if you forgot

### Deployment Issues

**"Function deployment failed"**
- Check that you're linked to the project: `supabase status`
- Verify your Supabase CLI is logged in: `supabase projects list`
- Check function code for syntax errors
- Review deployment logs for specific errors

**"Secret not found" error**
- Make sure you set secrets before deploying: `supabase secrets set KEY=value`
- Verify secrets are set: `supabase secrets list`
- Secrets are project-specific, make sure you're linked to the right project

### Runtime Issues

**"Stripe is not defined" error:**
- Make sure you installed `@stripe/stripe-js`: `npm install @stripe/stripe-js`
- Check that `VITE_STRIPE_PUBLISHABLE_KEY` is set in `.env`
- Restart your dev server after adding env variables

**Webhook not receiving events:**
- Check webhook URL is correct in Stripe Dashboard
- Verify webhook secret is set in Supabase: `supabase secrets list`
- Check Supabase Edge Function logs: Dashboard → Edge Functions → stripe-webhook → Logs
- Test webhook in Stripe Dashboard → Webhooks → Send test webhook

**Subscription not updating:**
- Check webhook events are being received in Stripe Dashboard → Webhooks → [Your endpoint] → Events
- Verify webhook handler is updating the database correctly
- Check browser console for errors
- Check Supabase Edge Function logs for errors

**"Failed to start checkout" error:**
- Verify `create-checkout-session` function is deployed
- Check that `STRIPE_SECRET_KEY` is set in Supabase secrets
- Verify `VITE_STRIPE_PRICE_ID` is set in `.env`
- Check Edge Function logs for specific errors

## Security Notes

- ✅ Never expose your Stripe secret key in frontend code
- ✅ Always verify webhook signatures
- ✅ Use HTTPS in production
- ✅ Validate all webhook events before processing
- ✅ Use environment variables for all secrets

## Next Steps

- Set up email notifications for subscription events
- Add a customer portal for managing subscriptions
- Implement subscription cancellation flow
- Add usage analytics and reporting

