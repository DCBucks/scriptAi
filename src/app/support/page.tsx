"use client";

import { useState } from "react";
import {
  Brain,
  Mail,
  MessageCircle,
  Clock,
  HelpCircle,
  ArrowLeft,
  Menu,
  FileUp,
  Crown,
  X,
  Mic,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-primary relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Navigation Button */}
        <div className="fixed top-6 right-6 z-50">
          <button
            onMouseEnter={() => setIsNavOpen(true)}
            className="p-3 bg-gradient-to-r from-primary/20 to-orange-500/20 hover:from-primary/30 hover:to-orange-500/30 backdrop-blur-xl border border-primary/30 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/25"
          >
            <Menu className="w-6 h-6 text-primary" />
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <HelpCircle className="w-16 h-16 text-primary" />
              <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl"></div>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-orange-300 to-orange-500 bg-clip-text text-transparent">
            Support
          </h1>
          <p className="text-xl text-orange-300 max-w-2xl mx-auto leading-relaxed">
            Need help with ScriptAi? We&apos;re here to assist you.
          </p>
        </div>

        {/* Support Card */}
        <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl shadow-primary/5">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Mail className="w-12 h-12 text-primary" />
                <div className="absolute -inset-3 bg-primary/20 rounded-full blur-lg"></div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-primary mb-4">
              Contact Our Support Team
            </h2>

            <p className="text-lg text-orange-300 mb-8 max-w-2xl mx-auto">
              For any questions, issues, or assistance with ScriptAi, please
              reach out to our support team.
            </p>

            <div className="bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-xl p-6 border border-primary/20 mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Mail className="w-6 h-6 text-primary" />
                <span className="text-lg font-medium text-primary">
                  Email Support
                </span>
              </div>
              <a
                href="mailto:clarkdylan007@gmail.com"
                className="text-2xl font-bold text-primary hover:text-orange-300 transition-colors duration-300 break-all"
              >
                clarkdylan007@gmail.com
              </a>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-primary/5 to-orange-500/5 rounded-xl p-6 border border-primary/10">
                <div className="flex items-center space-x-3 mb-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-medium text-primary">
                    Response Time
                  </span>
                </div>
                <p className="text-orange-300">
                  We typically respond within 24 hours during business days.
                </p>
              </div>

              <div className="bg-gradient-to-r from-primary/5 to-orange-500/5 rounded-xl p-6 border border-primary/10">
                <div className="flex items-center space-x-3 mb-3">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <span className="font-medium text-primary">
                    What to Include
                  </span>
                </div>
                <p className="text-orange-300">
                  Please include your account details and a description of your
                  issue.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Brain className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-primary">ScriptAi</span>
          </div>
          <p className="text-orange-400">
            AI-powered meeting intelligence for modern teams
          </p>
        </div>
      </div>

      {/* Navigation Drawer */}
      <NavigationDrawer
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        setIsNavOpen={setIsNavOpen}
      />
    </div>
  );
}

// Navigation Component
const NavigationDrawer = ({
  isOpen,
  onClose,
  setIsNavOpen,
}: {
  isOpen: boolean;
  onClose: () => void;
  setIsNavOpen: (open: boolean) => void;
}) => {
  const navItems = [
    {
      icon: <Mic className="w-5 h-5" />,
      label: "Transcriber",
      href: "/",
      isActive: false,
    },
    {
      icon: <FileUp className="w-5 h-5" />,
      label: "Uploads",
      href: "/uploads",
      isActive: false,
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Team",
      href: "/team",
      isActive: false,
    },
    {
      icon: <Crown className="w-5 h-5" />,
      label: "Upgrade",
      href: "/upgrade",
      isActive: false,
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      label: "Support",
      href: "/support",
      isActive: true,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Navigation Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-gradient-to-br from-surface/95 to-surface/90 backdrop-blur-xl border-l border-border/50 shadow-2xl shadow-primary/10 z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onMouseLeave={() => setIsNavOpen(false)}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center mb-8">
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-primary">ScriptAi</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 group ${
                  item.isActive
                    ? "bg-gradient-to-r from-primary/20 to-orange-500/20 border border-primary/30 text-primary"
                    : "hover:bg-primary/10 text-orange-300 hover:text-primary"
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    item.isActive
                      ? "bg-gradient-to-r from-primary to-orange-500 text-black"
                      : "bg-primary/10 group-hover:bg-primary/20"
                  }`}
                >
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
                {item.isActive && (
                  <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
                )}
              </a>
            ))}
          </nav>

          {/* Footer */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="border-t border-border/50 pt-4">
              <p className="text-sm text-orange-400 text-center">
                AI-powered meeting intelligence
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
