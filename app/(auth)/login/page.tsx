import React from "react";
import { LoginButton } from "@/components/auth/LoginButton";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getServerSession(authConfig);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or start using our platform today
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            <LoginButton provider="google" className="w-full" />
            <LoginButton provider="github" className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}