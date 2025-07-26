"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Crown,
  Brain,
  ArrowRight,
  Sparkles,
  Users,
  MessageCircle,
  Infinity,
} from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (sessionId) {
      // In a real app, you would verify the session with your backend
      // For now, we will just set it as verified
      setIsVerified(true);
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-background text-primary relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          {/* Success Icon */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-r from-primary to-orange-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-16 h-16 text-black" />
              </div>
              <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
              <Sparkles className="w-8 h-8 text-orange-300 absolute -top-2 -right-2 animate-bounce" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-orange-300 to-orange-500 bg-clip-text text-transparent">
            Welcome to Premium!
          </h1>

          <p className="text-xl text-orange-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            🎉 Your payment was successful! You now have access to all Premium
            features.
          </p>

          {/* Premium Features Summary */}
          <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-8 mb-8 shadow-2xl shadow-primary/5 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Crown className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-primary">
                You now have access to:
              </h2>
            </div>

            <div className="grid gap-4 text-left">
              <div className="flex items-center space-x-3">
                <Infinity className="w-6 h-6 text-primary" />
                <span className="text-orange-300 font-semibold">
                  Unlimited transcriptions
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-primary" />
                <span className="text-orange-300 font-semibold">
                  Add unlimited team members
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-6 h-6 text-primary" />
                <span className="text-orange-300 font-semibold">
                  Unlimited AI questions
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 text-black font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 transform hover:scale-105 flex items-center space-x-2"
            >
              <Brain className="w-5 h-5" />
              <span>Start Transcribing</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/upgrade"
              className="bg-gradient-to-r from-surface/60 to-surface/40 hover:from-surface/80 hover:to-surface/60 text-primary font-semibold py-4 px-8 rounded-xl border border-border/50 transition-all duration-300 hover:scale-105"
            >
              Manage Subscription
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-orange-400 text-sm">
              Need help?{" "}
              <Link href="/support" className="text-primary hover:underline">
                Contact Support
              </Link>
            </p>
            {sessionId && (
              <p className="text-orange-500 text-xs mt-2">
                Session ID: {sessionId.substring(0, 20)}...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
