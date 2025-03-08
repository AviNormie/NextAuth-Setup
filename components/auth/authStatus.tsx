"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { LogoutButton } from "./LogoutButton";

export function AuthStatus() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  if (isLoading) {
    return <div className="animate-pulse h-10 w-48 bg-gray-200 rounded"></div>;
  }

  if (!session) {
    return (
      <Link
        href="/login"
        className="text-blue-600 hover:text-blue-800 hover:underline"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || "User"}
            width={32}
            height={32}
            className="rounded-full"
          />
        )}
        <span className="text-gray-700">
          {session.user?.name || session.user?.email}
        </span>
      </div>
      <LogoutButton />
    </div>
  );
}