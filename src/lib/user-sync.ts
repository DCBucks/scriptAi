import { supabase } from "./supabase";

export interface UserData {
  clerk_user_id: string;
  email: string;
  name?: string | null;
}

export async function syncUserWithSupabase(userData: UserData) {
  try {
    console.log("Attempting to sync user:", userData.clerk_user_id);

    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_user_id", userData.clerk_user_id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is "not found" error, which is expected for new users
      console.error("Error fetching existing user:", fetchError);
      throw fetchError;
    }

    if (existingUser) {
      console.log("Updating existing user");
      // Update existing user
      const { data, error: updateError } = await supabase
        .from("users")
        .update({
          email: userData.email,
          name: userData.name,
          updated_at: new Date().toISOString(),
        })
        .eq("clerk_user_id", userData.clerk_user_id)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating user:", updateError);
        throw updateError;
      }
      console.log("User updated successfully");
      return data;
    } else {
      console.log("Creating new user");
      // Create new user
      const { data, error: insertError } = await supabase
        .from("users")
        .insert({
          clerk_user_id: userData.clerk_user_id,
          email: userData.email,
          name: userData.name,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting user:", insertError);
        throw insertError;
      }
      console.log("User created successfully");
      return data;
    }
  } catch (error) {
    console.error("Error syncing user with Supabase:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      code: (error as any)?.code,
      details: (error as any)?.details,
      hint: (error as any)?.hint,
    });
    throw error;
  }
}

export async function getUserFromSupabase(clerkUserId: string) {
  try {
    console.log('Fetching user from Supabase:', clerkUserId);
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_user_id", clerkUserId)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    console.log('User fetched successfully:', data?.id);
    return data;
  } catch (error) {
    console.error("Error fetching user from Supabase:", error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code,
      details: (error as any)?.details,
      hint: (error as any)?.hint
    });
    throw error;
  }
}
