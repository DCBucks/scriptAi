import { useEffect, useState } from "react";
import { useUser as useClerkUser } from "@clerk/nextjs";
import {
  syncUserWithSupabase,
  getUserFromSupabase,
  UserData,
} from "../lib/user-sync";
import { checkUserPremiumStatus } from "../lib/subscription";
import { Database } from "../lib/supabase";

type SupabaseUser = Database["public"]["Tables"]["users"]["Row"];

export function useUser() {
  const { user: clerkUser, isLoaded, isSignedIn } = useClerkUser();
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [premiumStatus, setPremiumStatus] = useState({
    isPremium: false,
    subscriptionStatus: null as string | null,
    subscriptionEndsAt: null as string | null,
    hasActiveSubscription: false,
  });

  useEffect(() => {
    async function handleUserSync() {
      console.log("🔍 useUser hook - handleUserSync called");
      console.log("🔍 isLoaded:", isLoaded);
      console.log("🔍 isSignedIn:", isSignedIn);
      console.log("🔍 clerkUser exists:", !!clerkUser);

      if (!isLoaded) return;

      setIsLoading(true);
      setError(null);

      try {
        if (isSignedIn && clerkUser) {
          console.log("🔍 User is signed in, attempting Supabase sync");
          // Always set basic user data from Clerk - don't wait for Supabase
          setIsInitialized(true);

          // Try Supabase sync in background - don't block the UI
          try {
            const userData: UserData = {
              clerk_user_id: clerkUser.id,
              email: clerkUser.primaryEmailAddress?.emailAddress || "",
              name: clerkUser.fullName || clerkUser.firstName || null,
            };

            // Sync user with Supabase (non-blocking)
            const syncedUser = await syncUserWithSupabase(userData);
            setSupabaseUser(syncedUser);

            // Check premium status (non-blocking)
            const premium = await checkUserPremiumStatus(clerkUser.id);
            setPremiumStatus(premium);
          } catch (supabaseErr) {
            console.warn(
              "🔍 Supabase sync failed (app will continue without it):",
              supabaseErr
            );
            // App continues to work without Supabase
            setSupabaseUser(null);
            setPremiumStatus({
              isPremium: false,
              subscriptionStatus: null,
              subscriptionEndsAt: null,
              hasActiveSubscription: false,
            });
          }
        } else {
          // User is not signed in
          setSupabaseUser(null);
          setPremiumStatus({
            isPremium: false,
            subscriptionStatus: null,
            subscriptionEndsAt: null,
            hasActiveSubscription: false,
          });
          setIsInitialized(true);
        }
      } catch (err) {
        console.error("Critical authentication error:", err);
        // Only set error for truly critical failures that prevent basic auth
        if (err instanceof Error && err.message.includes("Clerk")) {
          setError(err.message);
        }
        setIsInitialized(true); // Still allow app to load
      } finally {
        setIsLoading(false);
      }
    }

    handleUserSync();
  }, [isLoaded, isSignedIn, clerkUser]);

  return {
    clerkUser,
    supabaseUser,
    isLoaded,
    isSignedIn,
    isLoading,
    isInitialized,
    error,
    // Helper to get the current user's Supabase ID
    userId: supabaseUser?.id,
    // Premium status information
    isPremium: premiumStatus.isPremium,
    subscriptionStatus: premiumStatus.subscriptionStatus,
    subscriptionEndsAt: premiumStatus.subscriptionEndsAt,
    hasActiveSubscription: premiumStatus.hasActiveSubscription,
  };
}
