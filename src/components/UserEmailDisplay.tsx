"use client";

import { useState } from "react";
import { useClientUser } from "../hooks/useClientUser";
import { useClerk } from "@clerk/nextjs";
import { ChevronDown, LogOut, User, Users } from "lucide-react";
import Link from "next/link";
import ClientOnly from "./ClientOnly";

function UserEmailDisplayContent() {
  const { clerkUser, isSignedIn, isClient } = useClientUser();
  const { signOut } = useClerk();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!isClient || !isSignedIn || !clerkUser) {
    return null;
  }

  const userEmail = clerkUser.primaryEmailAddress?.emailAddress || "Unknown";

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="fixed top-6 left-6 z-50">
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2 text-primary font-medium text-sm hover:text-orange-300 transition-colors duration-300 cursor-pointer"
        >
          <span className="max-w-48 truncate">{userEmail}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsDropdownOpen(false)}
            />

            {/* Dropdown Content */}
            <div className="absolute top-full left-0 mt-2 bg-gradient-to-br from-surface/95 to-surface/90 backdrop-blur-xl border border-primary/30 rounded-xl shadow-2xl shadow-primary/25 z-50 min-w-64">
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-primary/20">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-orange-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <p className="text-primary font-medium text-sm">
                      {clerkUser.fullName || "User"}
                    </p>
                    <p className="text-orange-300 text-xs truncate max-w-48">
                      {userEmail}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <Link
                    href="/team"
                    className="w-full flex items-center space-x-3 px-3 py-2 text-orange-300 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300 group"
                  >
                    <Users className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-sm font-medium">Team</span>
                  </Link>

                  <Link
                    href="/profile"
                    className="w-full flex items-center space-x-3 px-3 py-2 text-orange-300 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300 group"
                  >
                    <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-sm font-medium">Profile</span>
                  </Link>

                  <div className="border-t border-primary/20 my-1"></div>

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-orange-300 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300 group"
                  >
                    <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function UserEmailDisplay() {
  return (
    <ClientOnly>
      <UserEmailDisplayContent />
    </ClientOnly>
  );
}
