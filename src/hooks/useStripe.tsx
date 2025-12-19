import { loadStripe, Stripe } from '@stripe/stripe-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      console.error('Stripe publishable key not found. Make sure VITE_STRIPE_PUBLISHABLE_KEY is set in .env');
      return null;
    }
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

export function useStripe() {
  const { user } = useAuth();

  const createCheckoutSession = async () => {
    if (!user) {
      toast.error('Please sign in to upgrade');
      return;
    }

    const priceId = import.meta.env.VITE_STRIPE_PRICE_ID;
    if (!priceId) {
      toast.error('Stripe price ID not configured');
      console.error('VITE_STRIPE_PRICE_ID not set in .env');
      return;
    }

    try {
      // Create checkout session via Supabase Edge Function
      // If you don't have Edge Functions set up, you can use a regular API endpoint
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          userId: user.id,
          userEmail: user.email,
          priceId: priceId,
        },
      });

      if (error) {
        console.error('Error creating checkout session:', error);
        toast.error('Failed to start checkout. Please try again.');
        return;
      }

      if (data?.sessionId) {
        // Redirect to Stripe Checkout
        const stripe = await getStripe();
        if (stripe) {
          const { error: redirectError } = await stripe.redirectToCheckout({
            sessionId: data.sessionId,
          });

          if (redirectError) {
            console.error('Stripe redirect error:', redirectError);
            toast.error('Failed to redirect to checkout');
          }
        }
      } else {
        // Fallback: Create checkout session directly (requires backend)
        toast.error('Checkout session creation failed. Please contact support.');
      }
    } catch (err) {
      console.error('Exception creating checkout session:', err);
      toast.error('An error occurred. Please try again.');
    }
  };

  const createCustomerPortalSession = async () => {
    if (!user) {
      toast.error('Please sign in');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        body: {
          userId: user.id,
        },
      });

      if (error) {
        console.error('Error creating portal session:', error);
        toast.error('Failed to open customer portal');
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Exception creating portal session:', err);
      toast.error('An error occurred. Please try again.');
    }
  };

  return {
    createCheckoutSession,
    createCustomerPortalSession,
  };
}

