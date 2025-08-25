/**
 * @fileoverview Stripe webhook handler for billing events
 * @description Processes Stripe webhooks for subscription and payment events
 * @author AI Agent Generated
 * @version 1.0.0
 * @security-level CRITICAL
 * @compliance SOC2, GDPR, PCI-DSS
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { fetchMutation } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhook events
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('No Stripe signature found');
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Process the event
    const result = await processWebhookEvent(event);

    if (result.success) {
      return NextResponse.json({ received: true });
    } else {
      console.error('Webhook processing failed:', result.error);
      return NextResponse.json(
        { error: 'Processing failed' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Process different types of webhook events
 */
async function processWebhookEvent(event: Stripe.Event): Promise<{ success: boolean; error?: string }> {
  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        return await handleSubscriptionEvent(event);

      case 'customer.subscription.deleted':
        return await handleSubscriptionCancellation(event);

      case 'invoice.payment_succeeded':
        return await handlePaymentSuccess(event);

      case 'invoice.payment_failed':
        return await handlePaymentFailure(event);

      case 'checkout.session.completed':
        return await handleCheckoutCompleted(event);

      default:
        console.log(`Unhandled event type: ${event.type}`);
        return { success: true };
    }
  } catch (error) {
    console.error(`Error processing ${event.type}:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Handle subscription creation/updates
 */
async function handleSubscriptionEvent(event: Stripe.Event): Promise<{ success: boolean; error?: string }> {
  const subscription = event.data.object as Stripe.Subscription;
  const customerId = subscription.customer as string;

  try {
    // Get customer details to find user ID
    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
    const userId = customer.metadata?.userId;

    if (!userId) {
      console.error('No user ID found in customer metadata');
      return { success: false, error: 'No user ID in customer metadata' };
    }

    // Map Stripe price ID to plan ID
    const planId = mapStripePriceToPlan(subscription.items.data[0]?.price.id);

    if (!planId) {
      console.error('Unknown Stripe price ID:', subscription.items.data[0]?.price.id);
      return { success: false, error: 'Unknown price ID' };
    }

    // Update subscription in Convex
    await fetchMutation(api.billing.updateSubscription, {
      userId,
      planId,
      status: subscription.status === 'active' ? 'active' : 'canceled',
      stripeSubscriptionId: subscription.id,
      currentPeriodStart: subscription.current_period_start * 1000,
      currentPeriodEnd: subscription.current_period_end * 1000,
      cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
    });

    console.log(`Updated subscription for user ${userId}: ${planId}`);
    return { success: true };

  } catch (error) {
    console.error('Error handling subscription event:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCancellation(event: Stripe.Event): Promise<{ success: boolean; error?: string }> {
  const subscription = event.data.object as Stripe.Subscription;
  const customerId = subscription.customer as string;

  try {
    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
    const userId = customer.metadata?.userId;

    if (!userId) {
      return { success: false, error: 'No user ID in customer metadata' };
    }

    // Cancel subscription (downgrade to free)
    await fetchMutation(api.billing.updateSubscription, {
      userId,
      planId: 'free_user',
      status: 'canceled',
      stripeSubscriptionId: subscription.id,
      currentPeriodStart: Date.now(),
      currentPeriodEnd: Date.now(),
      cancelAtPeriodEnd: false,
    });

    console.log(`Cancelled subscription for user ${userId}`);
    return { success: true };

  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(event: Stripe.Event): Promise<{ success: boolean; error?: string }> {
  const invoice = event.data.object as Stripe.Invoice;
  const customerId = invoice.customer as string;

  try {
    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
    const userId = customer.metadata?.userId;

    if (!userId) {
      return { success: false, error: 'No user ID in customer metadata' };
    }

    // Log payment success (you might want to store this in a payments table)
    console.log(`Payment succeeded for user ${userId}: ${invoice.amount_paid} ${invoice.currency}`);

    // You could also update subscription status or send notifications here

    return { success: true };

  } catch (error) {
    console.error('Error handling payment success:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailure(event: Stripe.Event): Promise<{ success: boolean; error?: string }> {
  const invoice = event.data.object as Stripe.Invoice;
  const customerId = invoice.customer as string;

  try {
    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
    const userId = customer.metadata?.userId;

    if (!userId) {
      return { success: false, error: 'No user ID in customer metadata' };
    }

    // Log payment failure
    console.log(`Payment failed for user ${userId}: ${invoice.amount_due} ${invoice.currency}`);

    // You could mark subscription as past_due or send notifications here

    return { success: true };

  } catch (error) {
    console.error('Error handling payment failure:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Handle checkout completion
 */
async function handleCheckoutCompleted(event: Stripe.Event): Promise<{ success: boolean; error?: string }> {
  const session = event.data.object as Stripe.Checkout.Session;
  const customerId = session.customer as string;

  try {
    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
    const userId = customer.metadata?.userId;

    if (!userId) {
      return { success: false, error: 'No user ID in customer metadata' };
    }

    console.log(`Checkout completed for user ${userId}`);
    // Additional processing can be added here

    return { success: true };

  } catch (error) {
    console.error('Error handling checkout completion:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Map Stripe price ID to internal plan ID
 */
function mapStripePriceToPlan(stripePriceId?: string): string | null {
  if (!stripePriceId) return null;

  const priceMapping: Record<string, string> = {
    [process.env.STRIPE_BASIC_PRICE_ID || '']: 'basic_plan',
    [process.env.STRIPE_PREMIUM_PRICE_ID || '']: 'premium_plan',
  };

  return priceMapping[stripePriceId] || null;
}