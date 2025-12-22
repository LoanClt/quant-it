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
      // Verify user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to upgrade');
        return;
      }

      // Create checkout session via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          userId: user.id,
          userEmail: user.email,
          priceId: priceId,
        },
      });

      if (error) {
        console.error('Error creating checkout session:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        
        // Provide more specific error messages
        if (error.message?.includes('Function not found') || error.message?.includes('404')) {
          toast.error('Checkout function not deployed. Please deploy the create-checkout-session function.');
        } else if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
          toast.error('Authentication failed. Please check your Supabase configuration.');
        } else {
          toast.error(`Failed to start checkout: ${error.message || 'Unknown error'}`);
        }
        return;
      }

      if (data?.url) {
        // Redirect to Stripe Checkout using the session URL
        window.location.href = data.url;
      } else if (data?.sessionId) {
        // Fallback: If only sessionId is provided, construct the checkout URL
        // This shouldn't happen with the updated Edge Function, but kept for compatibility
        const checkoutUrl = `https://checkout.stripe.com/c/pay/${data.sessionId}`;
        window.location.href = checkoutUrl;
      } else if (data?.error) {
        // Edge Function returned an error
        console.error('Edge Function error:', data.error);
        toast.error(`Checkout failed: ${data.error}`);
      } else {
        // Fallback: Create checkout session directly (requires backend)
        console.error('No sessionId in response:', data);
        toast.error('Checkout session creation failed. Please check Edge Function logs.');
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

