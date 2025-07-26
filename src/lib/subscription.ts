import { supabase } from "./supabase";

// Subscription Management
export async function updateUserSubscription(
  userId: string,
  subscriptionData: {
    subscription_status: "active" | "cancelled" | "expired" | null;
    stripe_customer_id?: string;
    stripe_subscription_id?: string;
    subscription_ends_at?: string;
  }
) {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({
        ...subscriptionData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating subscription:", error);
    throw error;
  }
}

export async function checkUserPremiumStatus(clerkUserId: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select(
        "subscription_status, subscription_ends_at, stripe_subscription_id"
      )
      .eq("clerk_user_id", clerkUserId)
      .single();

    if (error) throw error;

    // User is premium if they have an active subscription with a Stripe subscription ID
    const isPremium =
      data.subscription_status === "active" &&
      data.stripe_subscription_id !== null &&
      (!data.subscription_ends_at ||
        new Date(data.subscription_ends_at) > new Date());

    return {
      isPremium,
      subscriptionStatus: data.subscription_status,
      subscriptionEndsAt: data.subscription_ends_at,
      hasActiveSubscription: data.stripe_subscription_id !== null,
    };
  } catch (error) {
    console.error("Error checking premium status:", error);
    return {
      isPremium: false,
      subscriptionStatus: null,
      subscriptionEndsAt: null,
      hasActiveSubscription: false,
    };
  }
}

// Transcription Count Management
export async function incrementTranscriptionCount(userId: string) {
  try {
    // First get the current count
    const { data: currentUser, error: fetchError } = await supabase
      .from("users")
      .select("transcription_count")
      .eq("id", userId)
      .single();

    if (fetchError) throw fetchError;

    // Then update with the incremented value
    const { data, error } = await supabase
      .from("users")
      .update({
        transcription_count: (currentUser.transcription_count || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select("transcription_count")
      .single();

    if (error) throw error;
    return data.transcription_count;
  } catch (error) {
    console.error("Error incrementing transcription count:", error);
    throw error;
  }
}

export async function checkTranscriptionLimit(clerkUserId: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select(
        "subscription_status, stripe_subscription_id, transcription_count"
      )
      .eq("clerk_user_id", clerkUserId)
      .single();

    if (error) throw error;

    const isPremium =
      data.subscription_status === "active" &&
      data.stripe_subscription_id !== null;
    const hasReachedLimit = !isPremium && data.transcription_count >= 2;

    return {
      isPremium,
      transcriptionCount: data.transcription_count,
      hasReachedLimit,
      remainingTranscriptions: isPremium
        ? Infinity
        : Math.max(0, 2 - data.transcription_count),
    };
  } catch (error) {
    console.error("Error checking transcription limit:", error);
    throw error;
  }
}

// Premium Feature Checks
export function canUseFeature(
  isPremium: boolean,
  feature: "unlimited_transcriptions" | "teams" | "ai_chat"
) {
  switch (feature) {
    case "unlimited_transcriptions":
      return isPremium;
    case "teams":
      return isPremium;
    case "ai_chat":
      return isPremium;
    default:
      return false;
  }
}
