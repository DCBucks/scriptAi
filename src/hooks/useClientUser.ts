"use client";

import { useEffect, useState } from "react";
import { useUser as useClerkUser } from "@clerk/nextjs";

export function useClientUser() {
  const { user: clerkUser, isLoaded, isSignedIn } = useClerkUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't return any user data until we're on the client
  if (!isClient) {
    return {
      clerkUser: null,
      isLoaded: false,
      isSignedIn: false,
      isClient: false,
      userId: null,
      isPremium: false,
      subscriptionStatus: null,
      subscriptionEndsAt: null,
      hasActiveSubscription: false,
    };
  }

  return {
    clerkUser,
    isLoaded,
    isSignedIn,
    isClient: true,
    userId: clerkUser?.id || null,
    isPremium: false, // We'll load this separately
    subscriptionStatus: null,
    subscriptionEndsAt: null,
    hasActiveSubscription: false,
  };
}
