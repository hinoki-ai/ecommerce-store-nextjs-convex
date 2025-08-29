import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Get the Convex URL from environment
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      return NextResponse.json(
        { error: "Convex URL not configured" },
        { status: 500 }
      );
    }

    // Forward the entire request to Convex
    const response = await fetch(`${convexUrl}/clerk-users-webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...Object.fromEntries(request.headers.entries()),
      },
      body: await request.text(),
    });

    if (!response.ok) {
      console.error("Convex webhook error:", response.status, response.statusText);
      return NextResponse.json(
        { error: "Webhook forwarding failed" },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}