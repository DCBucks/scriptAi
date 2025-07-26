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
  const [premiumStatus, setPremiumStatus] = useState({
    isPremium: false,
    subscriptionStatus: null as string | null,
    subscriptionEndsAt: null as string | null,
    hasActiveSubscription: false,
  });

  useEffect(() => {
    async function handleUserSync() {
      if (!isLoaded) return;

      setIsLoading(true);
      setError(null);

      try {
        if (isSignedIn && clerkUser) {
          // Prepare user data for Supabase
          const userData: UserData = {
            clerk_user_id: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress || "",
            name: clerkUser.fullName || clerkUser.firstName || null,
          };

          // Sync user with Supabase
          const syncedUser = await syncUserWithSupabase(userData);
          setSupabaseUser(syncedUser);

          // Check premium status
          const premium = await checkUserPremiumStatus(clerkUser.id);
          setPremiumStatus(premium);
        } else {
          // User is not signed in
          setSupabaseUser(null);
          setPremiumStatus({
            isPremium: false,
            subscriptionStatus: null,
            subscriptionEndsAt: null,
            hasActiveSubscription: false,
          });
        }
      } catch (err) {
        console.error("Error syncing user:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");

        // Try to fetch existing user if sync fails
        if (clerkUser?.id) {
          try {
            const existingUser = await getUserFromSupabase(clerkUser.id);
            setSupabaseUser(existingUser);
            setError(null); // Clear error if we successfully fetched existing user
          } catch (fetchErr) {
            console.error("Error fetching existing user:", fetchErr);
          }
        }
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
