"use client";

import { useState, useEffect } from "react";
import { useUser } from "../../hooks/useUser";
import {
  User,
  Mail,
  Crown,
  CreditCard,
  Calendar,
  Settings,
  Edit3,
  Save,
  X,
  Check,
  AlertCircle,
  ArrowLeft,
  Shield,
  Zap,
  Star,
} from "lucide-react";

interface BillingInfo {
  plan: "free" | "premium";
  price: number;
  billing: "monthly" | "yearly";
  nextBilling?: Date;
  subscriptionStatus: "active" | "cancelled" | "expired";
}

export default function ProfilePage() {
  const {
    clerkUser,
    isSignedIn,
    isPremium,
    subscriptionStatus,
    isLoading: authLoading,
  } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    plan: "free",
    price: 0,
    billing: "monthly",
    subscriptionStatus: "expired",
  });

  useEffect(() => {
    if (clerkUser) {
      setDisplayName(clerkUser.fullName || "");

      // Mock billing data based on premium status
      setTimeout(() => {
        if (isPremium) {
          setBillingInfo({
            plan: "premium",
            price: 29.99,
            billing: "monthly",
            nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            subscriptionStatus:
              subscriptionStatus === "active" ? "active" : "cancelled",
          });
        } else {
          setBillingInfo({
            plan: "free",
            price: 0,
            billing: "monthly",
            subscriptionStatus: "active",
          });
        }
        setIsLoading(false);
      }, 500);
    }
  }, [clerkUser, isPremium, subscriptionStatus]);

  const handleSaveProfile = () => {
    // In a real app, you would update the user profile here
    setIsEditing(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPlanBadge = (plan: string) => {
    if (plan === "premium") {
      return (
        <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-orange-400 px-3 py-1 rounded-full text-sm font-semibold border border-orange-500/30">
          <Crown className="w-4 h-4" />
          <span>Premium</span>
        </div>
      );
    }
    return (
      <div className="flex items-center space-x-2 bg-gradient-to-r from-surface/60 to-surface/40 text-orange-300 px-3 py-1 rounded-full text-sm font-medium border border-border/50">
        <User className="w-4 h-4" />
        <span>Free</span>
      </div>
    );
  };

  const getStatusBadge = (status: string, plan: string) => {
    switch (status) {
      case "active":
        return (
          <div className="flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-500/30">
            <Check className="w-4 h-4" />
            <span>{plan === "free" ? "Subscribed" : "Active"}</span>
          </div>
        );
      case "cancelled":
        return (
          <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-medium border border-yellow-500/30">
            <AlertCircle className="w-4 h-4" />
            <span>Cancelled</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2 bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium border border-red-500/30">
            <X className="w-4 h-4" />
            <span>Expired</span>
          </div>
        );
    }
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
            You need to be signed in to access your profile.
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
            <a
              href="/"
              className="flex items-center space-x-2 text-orange-300 hover:text-primary transition-colors duration-300 mr-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </a>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-2 flex items-center">
                <User className="w-10 h-10 mr-4" />
                Profile
              </h1>
              <p className="text-orange-300">
                Manage your account settings and billing information
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-primary flex items-center">
                <Settings className="w-6 h-6 mr-2" />
                Account Information
              </h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 bg-gradient-to-r from-primary/20 to-orange-500/20 hover:from-primary/30 hover:to-orange-500/30 text-primary px-4 py-2 rounded-lg border border-primary/30 transition-all duration-300"
              >
                <Edit3 className="w-4 h-4" />
                <span>{isEditing ? "Cancel" : "Edit"}</span>
              </button>
            </div>

            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-orange-500 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary">
                    {clerkUser?.fullName || "User"}
                  </h3>
                  <p className="text-orange-300 text-sm">Profile Picture</p>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-orange-300 mb-2">
                  Display Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/30 rounded-lg px-4 py-3 text-orange-100 focus:outline-none focus:border-primary transition-colors duration-300"
                  />
                ) : (
                  <div className="text-primary font-medium">
                    {displayName || "Not set"}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-orange-300 mb-2">
                  Email Address
                </label>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-orange-400" />
                  <span className="text-primary font-medium">
                    {clerkUser?.primaryEmailAddress?.emailAddress}
                  </span>
                </div>
                <p className="text-xs text-orange-400 mt-1">
                  Email cannot be changed here. Managed by authentication
                  provider.
                </p>
              </div>

              {/* Save Button */}
              {isEditing && (
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center space-x-2 bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 text-black px-4 py-2 rounded-lg font-semibold transition-all duration-300"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              )}
            </div>
          </div>

          {/* Billing Information */}
          <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-primary mb-6 flex items-center">
              <CreditCard className="w-6 h-6 mr-2" />
              Billing & Subscription
            </h2>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-orange-300">
                  Loading billing information...
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Current Plan */}
                <div>
                  <label className="block text-sm font-medium text-orange-300 mb-2">
                    Current Plan
                  </label>
                  <div className="flex items-center justify-between">
                    {getPlanBadge(billingInfo.plan)}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        ${billingInfo.price}
                        {billingInfo.plan === "premium" && (
                          <span className="text-sm text-orange-300 font-normal">
                            /{billingInfo.billing}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subscription Status */}
                <div>
                  <label className="block text-sm font-medium text-orange-300 mb-2">
                    Subscription Status
                  </label>
                  {getStatusBadge(
                    billingInfo.subscriptionStatus,
                    billingInfo.plan
                  )}
                </div>

                {/* Next Billing */}
                {billingInfo.nextBilling &&
                  billingInfo.subscriptionStatus === "active" && (
                    <div>
                      <label className="block text-sm font-medium text-orange-300 mb-2">
                        Next Billing Date
                      </label>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-orange-400" />
                        <span className="text-primary font-medium">
                          {formatDate(billingInfo.nextBilling)}
                        </span>
                      </div>
                    </div>
                  )}

                {/* Plan Features */}
                <div>
                  <label className="block text-sm font-medium text-orange-300 mb-3">
                    Plan Features
                  </label>
                  <div className="space-y-2">
                    {billingInfo.plan === "premium" ? (
                      <>
                        <div className="flex items-center space-x-2 text-green-400">
                          <Check className="w-4 h-4" />
                          <span className="text-sm">
                            Unlimited transcriptions
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-green-400">
                          <Check className="w-4 h-4" />
                          <span className="text-sm">Team collaboration</span>
                        </div>
                        <div className="flex items-center space-x-2 text-green-400">
                          <Check className="w-4 h-4" />
                          <span className="text-sm">Priority support</span>
                        </div>
                        <div className="flex items-center space-x-2 text-green-400">
                          <Check className="w-4 h-4" />
                          <span className="text-sm">Advanced analytics</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center space-x-2 text-orange-400">
                          <Star className="w-4 h-4" />
                          <span className="text-sm">
                            5 transcriptions per month
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-orange-400">
                          <Star className="w-4 h-4" />
                          <span className="text-sm">Basic features</span>
                        </div>
                        <div className="flex items-center space-x-2 text-orange-400">
                          <Star className="w-4 h-4" />
                          <span className="text-sm">Community support</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Upgrade Button */}
                {billingInfo.plan === "free" && (
                  <div className="pt-4 border-t border-border/30">
                    <a
                      href="/upgrade"
                      className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <Crown className="w-5 h-5" />
                      <span>Upgrade to Premium</span>
                    </a>
                  </div>
                )}

                {/* Manage Subscription */}
                {billingInfo.plan === "premium" && (
                  <div className="pt-4 border-t border-border/30">
                    <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-primary/20 to-orange-500/20 hover:from-primary/30 hover:to-orange-500/30 text-primary px-6 py-3 rounded-xl border border-primary/30 font-semibold transition-all duration-300">
                      <Settings className="w-5 h-5" />
                      <span>Manage Subscription</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
