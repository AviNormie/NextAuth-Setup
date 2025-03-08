"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface LoginButtonProps {
  provider: "google" | "github";
  className?: string;
}

export function LoginButton({ provider, className }: LoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);

    try {
      console.log("🔹 Attempting sign-in with", provider);

      // ✅ Step 1: Start authentication with callbackUrl pointing to our custom page
      const res = await signIn(provider, { 
        callbackUrl: "/auth/sync-after-login",
        redirect: true
      });
      
      // The rest of the logic will be handled in the /auth/sync-after-login page
      
    } catch (error) {
      console.error("❌ Error during login:", error);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className={`flex items-center justify-center gap-2 rounded-md px-4 py-2 text-white ${
        provider === "google"
          ? "bg-red-500 hover:bg-red-600"
          : "bg-gray-800 hover:bg-gray-900"
      } ${className || ""}`}
    >
      {loading ? "Signing in..." : `Sign in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`}
    </button>
  );
}