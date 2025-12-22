import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { sessionId, userId } = await req.json();

    if (!sessionId || !userId) {
      return new Response(JSON.stringify({ error: 'Missing sessionId or userId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Stripe
    const stripe = await import('https://esm.sh/stripe@14.21.0?target=deno');
    const stripeClient = stripe.default(stripeSecretKey || '', {
      apiVersion: '2023-10-16',
    });

    // Retrieve the checkout session from Stripe
    const session = await stripeClient.checkout.sessions.retrieve(sessionId);

    // Verify the session belongs to this user
    if (session.metadata?.user_id !== userId) {
      return new Response(JSON.stringify({ error: 'Session does not belong to this user' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if payment was successful
    if (session.payment_status !== 'paid') {
      return new Response(JSON.stringify({ 
        paid: false,
        payment_status: session.payment_status 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Payment is successful, update user profile
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const customerId = session.customer as string;

    let updateData: any = {
      is_paid: true,
      stripe_customer_id: customerId,
    };

    // If it's a subscription, get subscription details
    if (session.subscription) {
      const subscription = await stripeClient.subscriptions.retrieve(session.subscription as string);
      updateData.stripe_subscription_id = subscription.id;
      updateData.stripe_price_id = subscription.items.data[0]?.price.id;
    }

    // Check if profile exists first
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle();

    let result;
    if (existingProfile) {
      // Profile exists, update it
      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', userId)
        .select();

      if (error) {
        console.error('Error updating profile:', error);
        return new Response(JSON.stringify({ 
          paid: true,
          updated: false,
          error: error.message 
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      result = data;
    } else {
      // Profile doesn't exist, create it
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          ...updateData,
        })
        .select();

      if (error) {
        console.error('Error creating profile:', error);
        return new Response(JSON.stringify({ 
          paid: true,
          updated: false,
          error: error.message 
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      result = data;
    }

    return new Response(JSON.stringify({ 
      paid: true,
      updated: true,
      profile: result 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error verifying checkout session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

