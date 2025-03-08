// app/api/sync-user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";

// Make sure we're explicitly defining allowable methods
export async function POST(req: NextRequest) {
  console.log("🔹 sync-user API called with POST method");

  try {
    console.log("🔹 Fetching session...");
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      console.error("❌ Unauthorized: No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, name, image } = session.user;
    console.log("🔹 Session found:", { email, name, image });

    console.log("🔹 Connecting to database...");
    await connectDB();

    console.log("🔹 Checking if user exists in DB...");
    let user = await User.findOne({ email });

    if (!user) {
      console.log("🔹 Creating new user in DB...");
      user = await User.create({ email, name, image, createdAt: new Date() });
      console.log("✅ New user created:", user);
    } else {
      console.log("🔹 Updating existing user login timestamp...");
      user.lastLogin = new Date();
      await user.save();
      console.log("✅ User updated:", user);
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("❌ Error syncing user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Add OPTIONS method to handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'POST, OPTIONS'
    }
  });
}