import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature || !webhookSecret) {
      return new Response(JSON.stringify({ error: 'Missing signature' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.text();
    const stripe = await import('https://esm.sh/stripe@14.21.0?target=deno');
    const stripeClient = stripe.default(stripeSecretKey || '', {
      apiVersion: '2023-10-16',
    });

    // Verify webhook signature
    let event;
    try {
      event = stripeClient.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const userId = session.metadata?.user_id;
        const customerId = session.customer;

        console.log('Processing checkout.session.completed:', {
          userId,
          customerId,
          subscription: session.subscription,
          payment_status: session.payment_status,
          mode: session.mode,
        });

        // Handle subscription checkout
        if (userId && session.subscription) {
          // Get subscription details
          const subscription = await stripeClient.subscriptions.retrieve(session.subscription);
          
          const { data, error } = await supabase
            .from('profiles')
            .update({
              is_paid: true,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscription.id,
              stripe_price_id: subscription.items.data[0]?.price.id,
            })
            .eq('user_id', userId)
            .select();

          if (error) {
            console.error('Error updating profile for subscription:', error);
          } else {
            console.log('Profile updated successfully for subscription:', data);
          }
        } 
        // Handle one-time payment (if mode is 'payment' instead of 'subscription')
        else if (userId && session.payment_status === 'paid') {
          // For one-time payments, also mark as paid
          const { data, error } = await supabase
            .from('profiles')
            .update({
              is_paid: true,
              stripe_customer_id: customerId,
            })
            .eq('user_id', userId)
            .select();

          if (error) {
            console.error('Error updating profile for one-time payment:', error);
          } else {
            console.log('Profile updated successfully for one-time payment:', data);
          }
        }
        // Fallback: if we have customer ID but no userId in metadata, find user by customer
        else if (customerId) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('user_id')
            .eq('stripe_customer_id', customerId)
            .single();

          if (profile) {
            const subscriptionId = session.subscription;
            if (subscriptionId) {
              const subscription = await stripeClient.subscriptions.retrieve(subscriptionId);
              const { data, error } = await supabase
                .from('profiles')
                .update({
                  is_paid: true,
                  stripe_subscription_id: subscription.id,
                  stripe_price_id: subscription.items.data[0]?.price.id,
                })
                .eq('user_id', profile.user_id)
                .select();

              if (error) {
                console.error('Error updating profile via customer ID:', error);
              } else {
                console.log('Profile updated successfully via customer ID:', data);
              }
            } else {
              const { data, error } = await supabase
                .from('profiles')
                .update({
                  is_paid: true,
                })
                .eq('user_id', profile.user_id)
                .select();

              if (error) {
                console.error('Error updating profile (no subscription):', error);
              } else {
                console.log('Profile updated successfully (no subscription):', data);
              }
            }
          } else {
            console.warn('No profile found for customer ID:', customerId);
          }
        } else {
          console.warn('No userId or customerId found in checkout session:', session);
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const customerId = subscription.customer;

        // Find user by customer ID
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (profile) {
          const isActive = subscription.status === 'active' || subscription.status === 'trialing';
          
          await supabase
            .from('profiles')
            .update({
              is_paid: isActive,
              stripe_subscription_id: subscription.id,
              stripe_price_id: subscription.items.data[0]?.price.id,
            })
            .eq('user_id', profile.user_id);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const customerId = subscription.customer;

        // Find user by customer ID
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (profile) {
          await supabase
            .from('profiles')
            .update({
              is_paid: false,
              stripe_subscription_id: null,
            })
            .eq('user_id', profile.user_id);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any;
        const customerId = invoice.customer;

        // Find user by customer ID
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (profile) {
          await supabase
            .from('profiles')
            .update({
              is_paid: true,
            })
            .eq('user_id', profile.user_id);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        const customerId = invoice.customer;

        // Optional: You might want to notify the user or mark subscription as past_due
        // For now, we'll keep is_paid as true until subscription is actually canceled
        console.log('Payment failed for customer:', customerId);
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});

