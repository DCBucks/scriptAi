"use client";

import { AlertCircle, Database, RefreshCw } from "lucide-react";

interface SupabaseFallbackProps {
  error?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export default function SupabaseFallback({
  error,
  onRetry,
  showRetry = true,
}: SupabaseFallbackProps) {
  return (
    <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 backdrop-blur-xl border border-orange-500/30 rounded-xl p-6 mb-6">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <Database className="w-6 h-6 text-orange-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-orange-300 mb-2">
            Database Temporarily Unavailable
          </h3>
          <p className="text-orange-200 text-sm mb-4">
            Some features may be limited while we experience connectivity
            issues. You can still upload and process new files.
          </p>
          {error && (
            <details className="mb-4">
              <summary className="text-orange-400 text-xs cursor-pointer hover:text-orange-300">
                Technical details
              </summary>
              <p className="text-orange-200 text-xs mt-2 font-mono bg-black/20 p-2 rounded">
                {error}
              </p>
            </details>
          )}
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center space-x-2 text-orange-300 hover:text-orange-200 text-sm transition-colors duration-300"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
