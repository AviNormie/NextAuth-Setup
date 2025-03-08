import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI is not defined in environment variables");
}

let isConnected = false; // Track connection status

export default async function connectDB() {
  if (isConnected) {
    console.log("🔹 Using existing MongoDB connection");
    return;
  }

  try {
    console.log("🔹 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI as string);

    isConnected = true;
    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
}
