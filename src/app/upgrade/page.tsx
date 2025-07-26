"use client";

import { useState } from "react";
import {
  Brain,
  Crown,
  CheckCircle,
  ArrowLeft,
  Users,
  MessageCircle,
  Infinity,
  Zap,
  Shield,
  Star,
  Menu,
  FileUp,
  HelpCircle,
  X,
  Mic,
} from "lucide-react";
import Link from "next/link";
import { createCheckoutSession } from "@/lib/stripe";

export default function UpgradePage() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);
      const { url } = await createCheckoutSession();

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const premiumFeatures = [
    {
      icon: <Infinity className="w-6 h-6" />,
      title: "Unlimited Transcriptions",
      description:
        "Process as many meeting recordings as you need without any monthly limits",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration",
      description:
        "Add unlimited team members to collaborate on meeting insights together",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Unlimited AI Questions",
      description:
        "Ask unlimited follow-up questions to the chatbot about your meetings",
    },
  ];

  const currentPlanFeatures = [
    "2 transcriptions per month",
    "High-quality transcription",
    "AI-powered summaries",
    "Interactive Q&A (limited)",
    "Export capabilities",
  ];

  return (
    <div className="min-h-screen bg-background text-primary relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6">
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
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Crown className="w-16 h-16 text-primary" />
              <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl"></div>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-orange-300 to-orange-500 bg-clip-text text-transparent">
            Upgrade to Premium
          </h1>
          <p className="text-xl text-orange-300 max-w-3xl mx-auto leading-relaxed">
            Unlock unlimited transcriptions, team collaboration, and unlimited
            AI-powered insights
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Current Plan */}
          <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl shadow-primary/5">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-primary mb-2">
                Free Plan
              </h3>
              <div className="text-4xl font-bold text-primary mb-2">$0</div>
              <p className="text-orange-300">Perfect for getting started</p>
            </div>
            <ul className="space-y-4 mb-8">
              {currentPlanFeatures.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-orange-300">{feature}</span>
                </li>
              ))}
            </ul>
            <button className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg">
              Current Plan
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-primary/20 to-orange-500/20 backdrop-blur-xl border border-primary/50 rounded-2xl p-8 shadow-2xl shadow-primary/5 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-primary to-orange-500 text-black px-4 py-1 rounded-full text-sm font-bold">
                Recommended
              </span>
            </div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-primary mb-2">
                Premium Plan
              </h3>
              <div className="text-4xl font-bold text-primary mb-2">$10</div>
              <p className="text-orange-300">per month</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-orange-300 font-semibold">
                  Unlimited transcriptions
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-orange-300 font-semibold">
                  Add unlimited team members
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-orange-300 font-semibold">
                  Unlimited AI questions
                </span>
              </li>
              <li className="flex items-center space-x-3 opacity-0">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-orange-300 font-semibold">
                  Placeholder
                </span>
              </li>
              <li className="flex items-center space-x-3 opacity-0">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-orange-300 font-semibold">
                  Placeholder
                </span>
              </li>
            </ul>
            <button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 transform hover:scale-105 disabled:transform-none"
            >
              {isLoading ? "Processing..." : "Upgrade Now"}
            </button>
          </div>
        </div>

        {/* Premium Features Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">
              Everything You Get with Premium
            </h2>
            <p className="text-xl text-orange-300 max-w-3xl mx-auto">
              Unlock the full power of ScriptAi with unlimited access to all
              features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {premiumFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl shadow-primary/5 transform hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-primary to-orange-500 rounded-xl flex items-center justify-center text-black">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-orange-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
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
      isActive: true,
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      label: "Support",
      href: "/support",
      isActive: false,
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
