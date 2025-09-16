// app/api/auth/facebook/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import { generateToken } from "@/utils/jwt"; // you used this for Google

// simple connect helper (same pattern as your Google route)
const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI!);
  }
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const redirectUri = `${baseUrl}/api/auth/facebook/callback`;

    // Exchange code for access token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&client_secret=${process.env.FACEBOOK_APP_SECRET}&code=${code}`
    );
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      console.error("FB token exchange failed:", tokenData);
      return NextResponse.json({ error: "Failed to get access token", details: tokenData }, { status: 400 });
    }

    // Fetch user profile
    const profileRes = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${tokenData.access_token}`
    );
    const profile = await profileRes.json();
    if (!profile || profile.error) {
      console.error("FB profile error:", profile);
      return NextResponse.json({ error: "Failed to fetch profile", details: profile }, { status: 400 });
    }

    // Ensure DB connected
    await connectDB();

    // Upsert user by email (consistent with Google flow)
    const email = profile.email ?? `${profile.id}@facebook.com`;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: profile.name,
        email,
        avatar: profile.picture?.data?.url ?? "",
        role: "User",
        provider: "facebook",
        providerId: profile.id,
      });
    } else {
      // Update provider info if needed
      const shouldUpdate: any = {};
      if (user.provider !== "facebook") shouldUpdate.provider = "facebook";
      if (user.providerId !== profile.id) shouldUpdate.providerId = profile.id;
      if (profile.picture?.data?.url && user.avatar !== profile.picture.data.url) shouldUpdate.avatar = profile.picture.data.url;
      if (Object.keys(shouldUpdate).length) await User.updateOne({ _id: user._id }, { $set: shouldUpdate });
    }

    // Sign JWT (use same helper as Google)
    const jwtToken = generateToken(user._id.toString());

    // Redirect back to login page with token in query
    const redirectUrl = `${baseUrl}/login?token=${jwtToken}`;
    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error("Facebook callback error", err);
    return NextResponse.json({ error: "Facebook login failed", details: String(err) }, { status: 500 });
  }
}
