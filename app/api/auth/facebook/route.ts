// app/api/auth/facebook/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Base URL (local for dev, Vercel in prod)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const redirectUri = `${baseUrl}/api/auth/facebook/callback`;

    // Build Facebook OAuth URL
    const fbUrl = new URL("https://www.facebook.com/v18.0/dialog/oauth");
    fbUrl.searchParams.set("client_id", process.env.FACEBOOK_APP_ID!);
    fbUrl.searchParams.set("redirect_uri", redirectUri);
    fbUrl.searchParams.set("scope", "email,public_profile");
    fbUrl.searchParams.set("response_type", "code");

    // Redirect user to Facebook login page
    return NextResponse.redirect(fbUrl.toString());
  } catch (err) {
    console.error("facebook redirect error", err);
    return NextResponse.json(
      { error: "Failed to start Facebook login" },
      { status: 500 }
    );
  }
}
