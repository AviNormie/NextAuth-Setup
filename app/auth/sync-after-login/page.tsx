"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SyncAfterLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [syncStatus, setSyncStatus] = useState("Checking session...");
  const [error, setError] = useState("");

  useEffect(() => {
    const syncUser = async () => {
      if (status === "authenticated" && session?.user) {
        try {
          setSyncStatus("Syncing your account...");
          console.log("✅ Session authenticated, syncing user");
          
          // Explicitly set method and headers for the request
          const syncRes = await axios.post("/api/sync-user", {}, {
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          if (syncRes.data.success) {
            console.log("✅ User synced successfully:", syncRes.data);
            setSyncStatus("Account synced! Redirecting...");
            
            // Redirect to dashboard after successful sync
            setTimeout(() => {
              router.push("/dashboard");
            }, 1000);
          } else {
            const errorMsg = "User sync failed: " + (syncRes.data.error || "Unknown error");
            console.error("❌", errorMsg);
            setSyncStatus("Something went wrong.");
            setError(errorMsg);
          }
        } catch (error) {
          console.error("❌ Error syncing user:", error);
          let errorMessage = "Error syncing account.";
          
          // Extract more detailed error message if available
          const err = error;
            if (typeof err === "object" && err !== null) {
            if ("response" in err) {
              if (err.response && typeof err.response === "object") {
                if (err.response && typeof err.response === "object" && "status" in err.response && "statusText" in err.response) {
                  const response = err.response as { status: number; statusText: string };
                  errorMessage += ` Server responded with: ${response.status} ${response.statusText}`;
                }
              }
                if (err.response && typeof err.response === "object") {
                const responseData = (err.response as { data: { success: boolean; error?: string } }).data;
                console.log("Response data:", responseData);
                }
            } else if ("request" in err) {
              errorMessage += " No response received from server.";
            } else if ("message" in err) {
              errorMessage += ` ${err.message}`;
            }
            }
          
          setSyncStatus("Sync failed.");
          setError(errorMessage);
        }
      } else if (status === "unauthenticated") {
        console.error("❌ Not authenticated");
        setSyncStatus("Not authenticated. Redirecting to login...");
        
        // Redirect to login page if not authenticated
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      }
    };

    if (status !== "loading") {
      syncUser();
    }
  }, [session, status, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-lg bg-white p-8 shadow-md max-w-md w-full">
        <h1 className="mb-4 text-xl font-bold">Finalizing Login</h1>
        <p className="text-gray-600">{syncStatus}</p>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded text-red-800 text-sm">
            {error}
          </div>
        )}
        
        {!error && status === "loading" && (
          <div className="mt-4 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          </div>
        )}
        
        {error && (
          <button 
            onClick={() => router.push("/login")} 
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Back to Login
          </button>
        )}
      </div>
    </div>
  );
}