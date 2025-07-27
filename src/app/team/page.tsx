"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../hooks/useUser";
import Link from "next/link";
import ClientOnly from "../../components/ClientOnly";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  Users,
  Plus,
  Mail,
  Crown,
  Shield,
  User,
  MoreVertical,
  Trash2,
  Edit3,
  Send,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  UserPlus,
  Brain,
  Menu,
  ArrowLeft,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member";
  status: "active" | "pending" | "inactive";
  joinedAt: Date;
  invitedBy?: string;
}

function TeamContent() {
  const router = useRouter();
  const {
    clerkUser,
    isSignedIn,
    isLoaded,
    isPremium,
    isLoading: authLoading,
    isInitialized,
  } = useUser();

  // Redirect to landing page if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/landing");
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading state while checking authentication
  if (!isLoaded || !isInitialized) {
    return <LoadingSpinner />;
  }

  // Don't render content if not signed in (will redirect)
  if (!isSignedIn) {
    return null;
  }
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");
  const [showActions, setShowActions] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate loading team data
    setTimeout(() => {
      if (isPremium) {
        setTeamMembers([
          {
            id: "1",
            name: clerkUser?.fullName || "You",
            email: clerkUser?.primaryEmailAddress?.emailAddress || "",
            role: "owner",
            status: "active",
            joinedAt: new Date(),
          },
          {
            id: "2",
            name: "Sarah Johnson",
            email: "sarah@company.com",
            role: "admin",
            status: "active",
            joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            invitedBy: "You",
          },
          {
            id: "3",
            name: "Mike Chen",
            email: "mike@company.com",
            role: "member",
            status: "pending",
            joinedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            invitedBy: "You",
          },
        ]);
      }
      setIsLoading(false);
    }, 1000);
  }, [isPremium, clerkUser]);

  const handleInviteMember = () => {
    if (inviteEmail.trim()) {
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: inviteEmail.split("@")[0],
        email: inviteEmail,
        role: inviteRole,
        status: "pending",
        joinedAt: new Date(),
        invitedBy: "You",
      };
      setTeamMembers([...teamMembers, newMember]);
      setInviteEmail("");
      setIsInviting(false);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== memberId));
    setShowActions(null);
  };

  const getRoleIcon = (role: TeamMember["role"]) => {
    switch (role) {
      case "owner":
        return <Crown className="w-4 h-4 text-yellow-400" />;
      case "admin":
        return <Shield className="w-4 h-4 text-blue-400" />;
      case "member":
        return <User className="w-4 h-4 text-orange-300" />;
    }
  };

  const getStatusIcon = (status: TeamMember["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case "inactive":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Show loading spinner while authentication is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-orange-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-primary mb-2">
            Please Sign In
          </h1>
          <p className="text-orange-300">
            You need to be signed in to access your team.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-primary relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full p-6">
        {/* Header */}
        <div className="mb-8 pt-20">
          <div className="flex items-center mb-6">
            <Link
              href="/"
              className="flex items-center space-x-2 text-orange-300 hover:text-primary transition-colors duration-300 mr-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-2 flex items-center">
                <Users className="w-10 h-10 mr-4" />
                Team Management
              </h1>
              <p className="text-orange-300">
                Manage your team members and collaboration
              </p>
            </div>

            {isPremium && (
              <button
                onClick={() => setIsInviting(!isInviting)}
                className="flex items-center space-x-2 bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 text-black px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 transform hover:scale-105"
              >
                <UserPlus className="w-5 h-5" />
                <span>Invite Member</span>
              </button>
            )}
          </div>
        </div>

        {!isPremium ? (
          <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 backdrop-blur-xl border border-orange-500/50 rounded-2xl p-8 text-center">
            <Crown className="w-16 h-16 text-orange-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-primary mb-4">
              Premium Feature
            </h2>
            <p className="text-orange-300 mb-6 max-w-md mx-auto">
              Team management is available for premium users. Upgrade your plan
              to invite team members and collaborate on projects.
            </p>
            <Link
              href="/upgrade"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Crown className="w-5 h-5" />
              <span>Upgrade to Premium</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Invite Member Form */}
            {isInviting && (
              <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-6 mb-8 max-w-4xl mx-auto">
                <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
                  <Mail className="w-6 h-6 mr-2" />
                  Invite Team Member
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Enter email address..."
                      className="w-full bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/30 rounded-xl px-4 py-3 text-orange-100 placeholder-orange-400 focus:outline-none focus:border-primary transition-colors duration-300"
                    />
                  </div>
                  <select
                    value={inviteRole}
                    onChange={(e) =>
                      setInviteRole(e.target.value as "admin" | "member")
                    }
                    className="bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/30 rounded-xl px-4 py-3 text-orange-100 focus:outline-none focus:border-primary transition-colors duration-300"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleInviteMember}
                    className="flex items-center space-x-2 bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 text-black px-4 py-2 rounded-lg font-semibold transition-all duration-300"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Invitation</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsInviting(false);
                      setInviteEmail("");
                    }}
                    className="flex items-center space-x-2 bg-gradient-to-r from-surface/60 to-surface/40 hover:from-surface/80 hover:to-surface/60 text-primary px-4 py-2 rounded-lg border border-border/50 transition-all duration-300"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            )}

            {/* Team Members List */}
            <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-6 max-w-6xl mx-auto">
              <h3 className="text-xl font-semibold text-primary mb-6">
                Team Members ({teamMembers.length})
              </h3>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-orange-300">Loading team members...</p>
                </div>
              ) : teamMembers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-primary mb-2">
                    No Team Members Yet
                  </h4>
                  <p className="text-orange-300">
                    Start by inviting your first team member!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-orange-500/5 rounded-xl border border-primary/10"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary to-orange-500 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-black" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-primary">
                              {member.name}
                            </h4>
                            {getRoleIcon(member.role)}
                          </div>
                          <p className="text-orange-300 text-sm">
                            {member.email}
                          </p>
                          <div className="flex items-center space-x-3 mt-1">
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(member.status)}
                              <span className="text-xs text-orange-400 capitalize">
                                {member.status}
                              </span>
                            </div>
                            <span className="text-xs text-orange-400">
                              Joined {formatDate(member.joinedAt)}
                            </span>
                            {member.invitedBy && (
                              <span className="text-xs text-orange-400">
                                Invited by {member.invitedBy}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {member.role !== "owner" && (
                        <div className="relative">
                          <button
                            onClick={() =>
                              setShowActions(
                                showActions === member.id ? null : member.id
                              )
                            }
                            className="p-2 hover:bg-primary/10 rounded-lg transition-colors duration-300"
                          >
                            <MoreVertical className="w-4 h-4 text-orange-300" />
                          </button>

                          {showActions === member.id && (
                            <div className="absolute right-0 top-full mt-2 w-40 bg-surface/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl z-20">
                              <div className="p-2">
                                <button
                                  onClick={() => handleRemoveMember(member.id)}
                                  className="w-full flex items-center space-x-3 px-3 py-2 text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-300"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>Remove</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Disable SSR for this page to prevent hydration issues
const TeamPage = dynamic(() => Promise.resolve(TeamContent), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

export default TeamPage;
