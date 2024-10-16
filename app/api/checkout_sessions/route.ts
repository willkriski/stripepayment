import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
// Use the latest API version
})

export async function POST() {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID, // Make sure this environment variable is set
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    })

    if (!session.client_secret) {
      throw new Error('No client secret returned from Stripe');
    }

    console.log('Checkout Session created:', session.id);
    return NextResponse.json({ clientSecret: session.client_secret })
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error creating Checkout Session:', err.message);
      return NextResponse.json({ error: err.message }, { status: 500 });
    } else {
      console.error('Unexpected error:', err);
      return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
  }
}
