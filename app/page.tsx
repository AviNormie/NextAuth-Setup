import Link from "next/link";
import { AuthStatus } from "../components/auth/authStatus";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to{" "}
          <span className="text-blue-600">Next.js with NextAuth</span>
        </h1>

        <p className="mt-3 text-2xl">
          A complete authentication example with Google and GitHub providers
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/login"
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Sign In
          </Link>
          <Link 
            href="/dashboard"
            className="rounded-md bg-gray-200 px-4 py-2 text-gray-900 hover:bg-gray-300"
          >
            Dashboard
          </Link>
        </div>

        <div className="mt-10">
          <AuthStatus />
        </div>
      </main>

      <footer className="flex h-24 w-full items-center justify-center border-t">
        <p>
          Powered by{" "}
          <span className="font-bold">Next.js and NextAuth</span>
        </p>
      </footer>
    </div>
  );
}