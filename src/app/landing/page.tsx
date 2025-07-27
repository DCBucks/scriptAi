"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Brain,
  Mic,
  MessageCircle,
  Download,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Play,
  Users,
  Clock,
  Zap,
  Shield,
  Star,
  ChevronRight,
} from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function LandingPage() {
  const router = useRouter();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleGoToDashboard = () => {
    router.push("/");
  };

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Analysis",
      description:
        "Intelligent summaries, key points, and actionable insights from your meetings",
    },
    {
      icon: <Mic className="w-6 h-6" />,
      title: "High-Quality Transcription",
      description:
        "Crystal clear audio-to-text conversion powered by OpenAI&apos;s Whisper technology",
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Export & Share",
      description:
        "Download summaries, transcripts, and insights in multiple formats",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Interactive Q&A",
      description:
        "Ask specific questions about your meeting content and get instant answers",
    },
  ];

  const benefits = [
    "Save hours of manual note-taking",
    "Never miss important details again",
    "Get instant meeting insights",
    "Improve team collaboration",
    "Track action items automatically",
    "Professional meeting documentation",
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager",
      company: "TechCorp",
      content:
        "ScriptAi has transformed how we handle meeting follow-ups. The AI insights are incredibly accurate!",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Sales Director",
      company: "GrowthCo",
      content:
        "I can focus on the conversation instead of taking notes. The summaries are perfect for client follow-ups.",
      rating: 5,
    },
    {
      name: "Emily Watson",
      role: "Team Lead",
      company: "InnovateLab",
      content:
        "The Q&A feature is a game-changer. I can quickly find specific information from past meetings.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-primary relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-primary">ScriptAi</span>
            </div>
            <div className="flex items-center space-x-6">
              <a
                href="#features"
                className="text-orange-300 hover:text-primary transition-colors duration-300"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-orange-300 hover:text-primary transition-colors duration-300"
              >
                Pricing
              </a>

              <SignedOut>
                <SignUpButton fallbackRedirectUrl="/">
                  <button className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 text-black font-bold py-2 px-6 rounded-lg transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 transform hover:scale-105">
                    Get Started
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                      userButtonPopoverCard: "bg-surface border border-border",
                      userButtonPopoverActionButton:
                        "text-orange-300 hover:text-primary",
                    },
                  }}
                />
              </SignedIn>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/20 to-orange-500/20 text-primary px-4 py-2 rounded-full border border-primary/30 mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">
                AI-Powered Meeting Intelligence
              </span>
            </div>
            <h1 className="text-7xl font-bold mb-8 bg-gradient-to-r from-primary via-orange-300 to-orange-500 bg-clip-text text-transparent leading-tight">
              Transform Meeting Recordings
              <br />
              Into Actionable Insights
            </h1>
            <p className="text-2xl text-orange-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Upload your meeting audio and get instant AI-generated summaries,
              key points, and interactive Q&A. Never miss important details
              again.
            </p>
            <div className="flex items-center justify-center mb-16">
              <SignedOut>
                <SignUpButton fallbackRedirectUrl="/">
                  <button className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 text-black font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 transform hover:scale-105 text-lg">
                    Try for Free
                    <ArrowRight className="w-5 h-5 inline ml-2" />
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <button
                  onClick={handleGoToDashboard}
                  className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 text-black font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 transform hover:scale-105 text-lg"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 inline ml-2" />
                </button>
              </SignedIn>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-primary mb-6">
              Everything You Need for
              <br />
              <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                Meeting Intelligence
              </span>
            </h2>
            <p className="text-xl text-orange-300 max-w-3xl mx-auto">
              From transcription to insights, ScriptAi handles every aspect of
              meeting analysis with cutting-edge AI technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
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
        </section>

        {/* Demo Video Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl shadow-primary/5">
              {/* Loom Video Embed */}
              <div className="aspect-video rounded-xl overflow-hidden">
                <iframe
                  src="YOUR_LOOM_EMBED_URL_HERE"
                  className="w-full h-full border-0"
                  allowFullScreen
                  title="ScriptAi Demo Video"
                ></iframe>
              </div>

              {/* Video Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-black font-bold">1</span>
                  </div>
                  <h4 className="font-bold text-primary mb-2">Upload Audio</h4>
                  <p className="text-orange-300 text-sm">
                    Drag & drop or click to select your meeting recording
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-black font-bold">2</span>
                  </div>
                  <h4 className="font-bold text-primary mb-2">AI Processing</h4>
                  <p className="text-orange-300 text-sm">
                    Our AI transcribes and analyzes your meeting content
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-black font-bold">3</span>
                  </div>
                  <h4 className="font-bold text-primary mb-2">Get Insights</h4>
                  <p className="text-orange-300 text-sm">
                    Review summaries, key points, and ask follow-up questions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl shadow-primary/5">
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-orange-300">Accuracy Rate</div>
            </div>
            <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl shadow-primary/5">
              <div className="text-4xl font-bold text-primary mb-2">30s</div>
              <div className="text-orange-300">Average Processing</div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-bold text-primary mb-8">
                Why Teams Choose
                <br />
                <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                  ScriptAi
                </span>
              </h2>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-primary to-orange-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-black" />
                    </div>
                    <span className="text-orange-300 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl shadow-primary/5">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-orange-500 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary">
                      Lightning Fast
                    </h3>
                    <p className="text-orange-300">
                      Process 1-hour meetings in under 5 minutes
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-orange-500 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary">
                      Team Ready
                    </h3>
                    <p className="text-orange-300">
                      Share insights and collaborate seamlessly
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-primary mb-6">
              Simple, Transparent
              <br />
              <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                Pricing
              </span>
            </h2>
            <p className="text-xl text-orange-300 max-w-3xl mx-auto">
              Start with our free plan, upgrade to premium when you need more.
              No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl shadow-primary/5">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-primary mb-2">
                  Free Plan
                </h3>
                <div className="text-4xl font-bold text-primary mb-2">$0</div>
                <p className="text-orange-300">Perfect for getting started</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-orange-300">
                    2 transcriptions per month
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-orange-300">
                    High-quality transcription
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-orange-300">AI-powered summaries</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-orange-300">Interactive Q&A</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-orange-300">Export capabilities</span>
                </li>
              </ul>
              <SignedOut>
                <SignUpButton fallbackRedirectUrl="/">
                  <button className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg">
                    Get Started Free
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <button
                  onClick={handleGoToDashboard}
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg"
                >
                  Go to Dashboard
                </button>
              </SignedIn>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-primary/20 to-orange-500/20 backdrop-blur-xl border border-primary/50 rounded-2xl p-8 shadow-2xl shadow-primary/5 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-primary to-orange-500 text-black px-4 py-1 rounded-full text-sm font-bold">
                  Most Popular
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
                  <span className="text-orange-300">
                    Unlimited transcriptions
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-orange-300">
                    High-quality transcription
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-orange-300">AI-powered summaries</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-orange-300">Interactive Q&A</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-orange-300">Export capabilities</span>
                </li>
              </ul>
              <SignedOut>
                <SignUpButton fallbackRedirectUrl="/">
                  <button className="w-full bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 text-black font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40">
                    Upgrade to Premium
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <button
                  onClick={handleGoToDashboard}
                  className="w-full bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 text-black font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40"
                >
                  Upgrade to Premium
                </button>
              </SignedIn>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-border/50">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Brain className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-primary">ScriptAi</span>
            </div>
            <p className="text-orange-300 mb-4">
              AI-powered meeting intelligence for modern teams.
            </p>
            <div className="border-t border-border/50 pt-8 text-center text-orange-400">
              <p>&copy; 2024 ScriptAi. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
