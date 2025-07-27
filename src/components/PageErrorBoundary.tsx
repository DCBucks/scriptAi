"use client";

import React from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface PageErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface PageErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>;
  pageName?: string;
}

export class PageErrorBoundary extends React.Component<
  PageErrorBoundaryProps,
  PageErrorBoundaryState
> {
  constructor(props: PageErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): PageErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      `Error in ${this.props.pageName || "page"}:`,
      error,
      errorInfo
    );
    this.setState({
      error,
      errorInfo,
    });
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    // Force page reload to reset all state
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent error={this.state.error} reset={this.reset} />
        );
      }

      const isAuthError =
        this.state.error?.message?.includes("auth") ||
        this.state.error?.message?.includes("user") ||
        this.state.error?.message?.includes("clerk");

      return (
        <div className="min-h-screen bg-background text-primary flex items-center justify-center p-6">
          <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-primary/5">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-primary mb-4">
                {isAuthError ? "Authentication Error" : "Page Error"}
              </h2>
              <p className="text-orange-300 mb-6">
                {isAuthError
                  ? "There was a problem with authentication. Please try refreshing the page or return to the dashboard."
                  : `We encountered an error loading the ${this.props.pageName || "page"}. Please try refreshing or go back to the dashboard.`}
              </p>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={this.reset}
                  className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 text-black font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 transform hover:scale-105 flex items-center space-x-2 justify-center"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Refresh Page</span>
                </button>
                <Link
                  href="/"
                  className="bg-gradient-to-r from-surface/60 to-surface/40 hover:from-surface/80 hover:to-surface/60 text-primary font-semibold py-3 px-6 rounded-xl border border-border/50 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 justify-center"
                >
                  <Home className="w-5 h-5" />
                  <span>Back to Dashboard</span>
                </Link>
              </div>
              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="text-orange-400 cursor-pointer">
                    Error details (development only)
                  </summary>
                  <pre className="mt-2 text-xs text-orange-200 bg-black/20 p-3 rounded overflow-auto max-h-32">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PageErrorBoundary;
