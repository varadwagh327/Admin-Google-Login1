import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import User from "@/models/User";
import { generateToken } from "@/utils/jwt";
import mongoose from "mongoose";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI!);
  }
};

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    await connectDB();

    // Verify ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email || !payload.name) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    // Check if user already exists
    let user = await User.findOne({ email: payload.email });

    if (!user) {
      // ✅ Fetch extra data from Google People API
      const peopleRes = await fetch(
        "https://people.googleapis.com/v1/people/me?personFields=birthdays,phoneNumbers,addresses",
        {
          headers: {
            Authorization: `Bearer ${token}`, // token from Google Sign-In
          },
        }
      );

      const peopleData = await peopleRes.json();
      const birthday = peopleData.birthdays?.[0]?.date
        ? `${peopleData.birthdays[0].date.year || ""}-${peopleData.birthdays[0].date.month || ""}-${peopleData.birthdays[0].date.day || ""}`
        : "";
      const phone = peopleData.phoneNumbers?.[0]?.value || "";
      const address = peopleData.addresses?.[0]?.formattedValue || "";

      // Create new user with extra fields
      user = await User.create({
        name: payload.name,
        email: payload.email,
        avatar: payload.picture,
        role: "User",
        birthday,
        phone,
        address,
        provider: "google",
        providerId: payload.sub, // Google unique ID
      });
    }

    // Generate JWT
    const jwtToken = generateToken(user._id.toString());

    return NextResponse.json({ token: jwtToken, user });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
