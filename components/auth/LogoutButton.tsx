"use client";

import React from "react";
import { signOut } from "next-auth/react";

interface LogoutButtonProps {
  className?: string;
}

export function LogoutButton({ className }: LogoutButtonProps) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className={`rounded-md bg-gray-200 px-4 py-2 text-gray-900 hover:bg-gray-300 ${
        className || ""
      }`}
    >
      Sign Out
    </button>
  );
}