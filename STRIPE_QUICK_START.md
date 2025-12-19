# Stripe Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Get Stripe Keys
- Go to https://dashboard.stripe.com (Test Mode)
- Copy your **Publishable key** (`pk_test_...`)
- Copy your **Secret key** (`sk_test_...`)

### 2. Create a Product
- Products → Add product
- Name: "Premium Subscription"
- Price: $5/month (recurring)
- Copy the **Price ID** (`price_...`)

### 3. Set Environment Variables

Create a `.env` file in your project root:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
VITE_STRIPE_PRICE_ID=price_your_price_id_here
```

### 4. Run Database Migration

In Supabase SQL Editor, run:
```sql
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;
```

### 5. Install Supabase CLI

**macOS (Homebrew - Recommended):**
```bash
brew tap supabase/tap
brew install supabase
```

**If you get permission errors with npm, use Homebrew instead:**
```bash
# If Homebrew not installed, install it first:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Then install Supabase CLI:
brew install supabase/tap/supabase
```

**Alternative: Use npx (no installation needed)**
```bash
# Use npx to run commands without installing globally
npx supabase@latest --version
```

**Verify:**
```bash
supabase --version
# or
npx supabase@latest --version
```

### 6. Link to Your Project

```bash
# Get your project ref ID from Supabase Dashboard → Settings → General
supabase link --project-ref your-project-ref-id
```

### 7. Deploy Edge Functions

```bash
# Set secrets first
supabase secrets set STRIPE_SECRET_KEY=sk_test_your_key_here

# Deploy functions
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
supabase functions deploy create-portal-session
```

**Note:** You'll set `STRIPE_WEBHOOK_SECRET` after creating the webhook in Stripe (step 6).

### 8. Configure Stripe Webhook

1. In Stripe Dashboard → Webhooks → Add endpoint
2. URL: `https://your-project.supabase.co/functions/v1/stripe-webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
4. Copy webhook secret and add to Supabase secrets

### 9. Add Webhook Secret

After creating the webhook in Stripe, add the secret:

```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 10. Test It!

1. Restart your dev server
2. Go to `/pricing`
3. Click "Upgrade to Premium"
4. Use test card: `4242 4242 4242 4242`
5. Check that `is_paid` is `true` in database

## 📚 Full Documentation

See `SETUP_STRIPE.md` for detailed instructions.

## 🐛 Troubleshooting

**"Stripe is not defined"**
- Restart dev server after adding `.env` file
- Check `VITE_STRIPE_PUBLISHABLE_KEY` is set correctly

**"command not found: supabase"**
- Install CLI: `npm install -g supabase` or `brew install supabase/tap/supabase`
- Make sure npm global bin is in your PATH
- Restart terminal after installation

**"Error linking project"**
- Get project ref ID from Supabase Dashboard → Settings → General
- Make sure you have access to the project

**Webhook not working**
- Check webhook URL in Stripe Dashboard (use your project ref ID)
- Verify webhook secret is set: `supabase secrets list`
- Check Edge Function logs in Supabase Dashboard → Edge Functions → stripe-webhook → Logs

**Checkout not redirecting**
- Check Edge Function is deployed
- Verify `STRIPE_SECRET_KEY` is set in Supabase secrets
- Check browser console for errors


