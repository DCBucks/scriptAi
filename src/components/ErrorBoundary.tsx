"use client";

import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent error={this.state.error} reset={this.reset} />
        );
      }

      return (
        <div className="min-h-screen bg-background text-primary flex items-center justify-center p-6">
          <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-primary/5">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-primary mb-4">
                Something went wrong
              </h2>
              <p className="text-orange-300 mb-6">
                We encountered an unexpected error. Please try refreshing the
                page.
              </p>
              <button
                onClick={this.reset}
                className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 text-black font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 transform hover:scale-105 flex items-center space-x-2 mx-auto"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Try Again</span>
              </button>
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

export default ErrorBoundary;
