"use client";

/**
 * @file DbOfflineMessage.tsx
 * @description Fallback message displayed when the database connection is offline.
 */

import { Database, RefreshCw } from "lucide-react";
import * as React from "react";

interface DbOfflineMessageProps {
  title?: string;
  description?: string;
  className?: string;
  onRetry?: () => void;
}

export default function DbOfflineMessage({
  title = "Database Connection Offline",
  description = "We are temporarily unable to load this content because the database is unreachable. Please try again later.",
  className = "",
  onRetry,
}: DbOfflineMessageProps) {
  const [isRetrying, setIsRetrying] = React.useState(false);

  const handleRetry = () => {
    if (onRetry) {
      setIsRetrying(true);
      onRetry();
      setTimeout(() => setIsRetrying(false), 1000);
    } else {
      setIsRetrying(true);
      window.location.reload();
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-zinc-200/60 bg-white/40 p-8 text-center shadow-xs backdrop-blur-md transition-all duration-300 md:p-12 ${className}`}
    >
      <div className="text-zinc-650 relative mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100">
        <Database className="h-6 w-6" />
        <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
          <span className="bg-red-450 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
          <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-red-500"></span>
        </span>
      </div>
      <h3 className="font-outfit text-lg font-bold text-black sm:text-xl">{title}</h3>
      <p className="text-zinc-550 mt-2 max-w-md text-sm leading-relaxed sm:text-base">
        {description}
      </p>
      <button
        onClick={handleRetry}
        disabled={isRetrying}
        className="mt-6 inline-flex items-center gap-2 rounded-full border border-black bg-black px-6 py-2.5 text-xs font-bold tracking-wider text-white uppercase transition-all duration-300 hover:bg-zinc-900 disabled:opacity-50"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${isRetrying ? "animate-spin" : ""}`} />
        <span>{isRetrying ? "Retrying..." : "Retry Connection"}</span>
      </button>
    </div>
  );
}
