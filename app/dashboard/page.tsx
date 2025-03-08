import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { LogoutButton } from "@/components/auth/LogoutButton";
import Image from "next/image";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions); // ✅ Use authOptions
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            {session?.user?.image && (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <div className="flex flex-col">
              <span className="font-medium">
                {session?.user?.name || "User"}
              </span>
              <span className="text-sm text-gray-500">
                {session?.user?.email}
              </span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6 bg-white">
            <h2 className="text-xl font-semibold mb-4">Welcome to your dashboard!</h2>
            <p className="mb-4">
              You are successfully authenticated with NextAuth.js.
            </p>
            <Link 
              href="/profile" 
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Go to Profile
            </Link>
          </div>
        </div>
      </main>
    </div>
  ); 
}
