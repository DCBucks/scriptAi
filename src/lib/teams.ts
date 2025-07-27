import { supabase, isSupabaseAvailable } from "./supabase";

export interface TeamData {
  name: string;
  owner_id: string;
}

export interface TeamMemberData {
  team_id: string;
  user_id: string;
  role?: "owner" | "admin" | "member";
  invited_by: string;
}

// Team Management
export async function createTeam(teamData: TeamData) {
  try {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error("Supabase configuration missing");
    }

    const { data, error } = await supabase
      .from("teams")
      .insert(teamData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating team:", error);
    throw error;
  }
}

export async function getUserTeams(userId: string) {
  try {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error("Supabase configuration missing");
    }

    const { data, error } = await supabase
      .from("teams")
      .select(
        `
        *,
        team_members!inner(
          id,
          role,
          status,
          joined_at
        )
      `
      )
      .or(`owner_id.eq.${userId},team_members.user_id.eq.${userId}`)
      .eq("team_members.status", "active");

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching user teams:", error);
    throw error;
  }
}

export async function getTeamDetails(teamId: string) {
  try {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error("Supabase configuration missing");
    }

    const { data, error } = await supabase
      .from("teams")
      .select(
        `
        *,
        team_members(
          id,
          role,
          status,
          invited_at,
          joined_at,
          users(
            id,
            name,
            email
          )
        )
      `
      )
      .eq("id", teamId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching team details:", error);
    throw error;
  }
}

export async function updateTeam(teamId: string, updates: Partial<TeamData>) {
  try {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error("Supabase configuration missing");
    }

    const { data, error } = await supabase
      .from("teams")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", teamId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating team:", error);
    throw error;
  }
}

export async function deleteTeam(teamId: string) {
  try {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error("Supabase configuration missing");
    }

    const { error } = await supabase.from("teams").delete().eq("id", teamId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting team:", error);
    throw error;
  }
}

// Team Member Management
export async function inviteTeamMember(memberData: TeamMemberData) {
  try {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error("Supabase configuration missing");
    }

    const { data, error } = await supabase
      .from("team_members")
      .insert({
        ...memberData,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error inviting team member:", error);
    throw error;
  }
}

export async function acceptTeamInvitation(teamMemberId: string) {
  try {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error("Supabase configuration missing");
    }

    const { data, error } = await supabase
      .from("team_members")
      .update({
        status: "active",
        joined_at: new Date().toISOString(),
      })
      .eq("id", teamMemberId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error accepting team invitation:", error);
    throw error;
  }
}

export async function updateTeamMemberRole(
  teamMemberId: string,
  newRole: "admin" | "member"
) {
  try {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error("Supabase configuration missing");
    }

    const { data, error } = await supabase
      .from("team_members")
      .update({ role: newRole })
      .eq("id", teamMemberId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating team member role:", error);
    throw error;
  }
}

export async function removeTeamMember(teamMemberId: string) {
  try {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error("Supabase configuration missing");
    }

    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("id", teamMemberId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error removing team member:", error);
    throw error;
  }
}

export async function leaveTeam(teamId: string, userId: string) {
  try {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error("Supabase configuration missing");
    }

    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("team_id", teamId)
      .eq("user_id", userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error leaving team:", error);
    throw error;
  }
}

// Team Permissions
export async function checkTeamPermission(
  teamId: string,
  userId: string,
  requiredRole: "owner" | "admin" | "member" = "member"
) {
  try {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error("Supabase configuration missing");
    }

    const { data, error } = await supabase
      .from("team_members")
      .select("role")
      .eq("team_id", teamId)
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    if (error && error.code !== "PGRST116") throw error;
    if (!data) return false;

    const roleHierarchy: { [key: string]: number } = {
      owner: 3,
      admin: 2,
      member: 1,
    };
    return roleHierarchy[data.role] >= roleHierarchy[requiredRole];
  } catch (error) {
    console.error("Error checking team permission:", error);
    return false;
  }
}

export async function getPendingInvitations(userId: string) {
  try {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error("Supabase configuration missing");
    }

    const { data, error } = await supabase
      .from("team_members")
      .select(
        `
        id,
        invited_at,
        teams(
          id,
          name,
          users!teams_owner_id_fkey(
            name,
            email
          )
        )
      `
      )
      .eq("user_id", userId)
      .eq("status", "pending");

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching pending invitations:", error);
    throw error;
  }
}
