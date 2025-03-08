// app/api/sync-user/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import axios from "axios";

// Constants
const MULTIVERSE_API_URL = "https://bu-multiverse.vercel.app/api/auth/login";
const MULTIVERSE_APP_NAME = "CampusCupid";
const MULTIVERSE_API_KEY = "d8dfa21f49dd5a0a7957416003f7ead2840f17a62adb007537b28c29382e2633";

export async function POST() {
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

    // Step 1: Connect to local database
    console.log("🔹 Connecting to database...");
    await connectDB();

    // Step 2: Check if user exists in local DB
    console.log("🔹 Checking if user exists in local DB...");
    let user = await User.findOne({ email });

    // Step 3: Create or update user in local DB
    if (!user) {
      console.log("🔹 Creating new user in local DB...");
      user = await User.create({ 
        email, 
        name, 
        image, 
        createdAt: new Date() 
      });
      console.log("✅ New user created in local DB:", user);
    } else {
      console.log("🔹 Updating existing user login timestamp...");
      user.lastLogin = new Date();
      await user.save();
      console.log("✅ User updated in local DB:", user);
    }

    // Step 4: Sync with multiverse database
    console.log("🔹 Syncing with multiverse database...");
    try {
      const multiverseResponse = await axios.post(
        MULTIVERSE_API_URL,
        {
          apiKey: MULTIVERSE_API_KEY,
          name: name,
          email: email,
          image: image || null,
          app: MULTIVERSE_APP_NAME
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (multiverseResponse.data.success) {
        console.log("✅ User synced with multiverse database:", multiverseResponse.data);
        
        // Optionally store the multiverse userId in your local user record
        if (multiverseResponse.data.userId) {
          user.multiverseId = multiverseResponse.data.userId;
          await user.save();
          console.log("✅ Stored multiverse ID in local user record");
        }
        
        return NextResponse.json({ 
          success: true, 
          user,
          multiverse: {
            userId: multiverseResponse.data.userId,
            credits: multiverseResponse.data.credits
          }
        });
      } else {
        console.error("❌ Multiverse sync failed:", multiverseResponse.data);
        // Still return success for local sync, but include multiverse error
        return NextResponse.json({ 
          success: true, 
          user,
          multiverse: {
            success: false,
            error: multiverseResponse.data.error || "Unknown error from multiverse API"
          }
        });
      }
    } catch (multiverseError) {
      console.error("❌ Error calling multiverse API:", multiverseError);
      
      // Still return success for local sync, but include multiverse error
      return NextResponse.json({ 
        success: true, 
        user,
        multiverse: {
          success: false,
          error: "Failed to connect to multiverse API"
        }
      });
    }
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