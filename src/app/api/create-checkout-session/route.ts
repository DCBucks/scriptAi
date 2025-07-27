import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Authentication required. Please log in to upgrade your account.",
        },
        { status: 401 }
      );
    }

    const { priceId } = await req.json();

    // Get user information for the checkout session
    // Note: You might want to fetch the user's email from Clerk or Supabase
    // For now, we'll let Stripe collect it

    // Create Checkout Sessions from body params
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId || process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/upgrade`,
      automatic_tax: { enabled: true },
      billing_address_collection: "required",
      customer_email: undefined, // You can add user email from Clerk here later
      metadata: {
        plan: "premium",
        clerk_user_id: userId, // Add user ID to metadata for webhook processing
      },
      subscription_data: {
        metadata: {
          plan: "premium",
          clerk_user_id: userId, // Add user ID to subscription metadata
        },
      },
    });

    return NextResponse.json({
      success: true,
      url: session.url,
    });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
