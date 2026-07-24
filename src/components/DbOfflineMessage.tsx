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
      className={`3xl:p-16 3xl:rounded-3xl 3xl:border-2 4xl:p-20 4xl:rounded-4xl 5xl:p-28 5xl:rounded-[3rem] flex flex-col items-center justify-center rounded-2xl border border-zinc-200/60 bg-white/40 p-8 text-center shadow-xs backdrop-blur-md transition-all duration-300 md:p-12 ${className}`}
    >
      <div className="text-zinc-650 3xl:h-20 3xl:w-20 3xl:mb-6 4xl:h-24 4xl:w-24 4xl:mb-8 5xl:h-32 5xl:w-32 5xl:mb-12 relative mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100">
        <Database className="3xl:h-9 3xl:w-9 4xl:h-11 4xl:w-11 5xl:h-16 5xl:w-16 h-6 w-6" />
        <span className="3xl:h-5 3xl:w-5 4xl:h-6 4xl:w-6 5xl:h-8 5xl:w-8 absolute top-0 right-0 flex h-3.5 w-3.5">
          <span className="bg-red-450 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
          <span className="3xl:h-5 3xl:w-5 4xl:h-6 4xl:w-6 5xl:h-8 5xl:w-8 relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-red-500"></span>
        </span>
      </div>
      <h3 className="font-outfit 3xl:text-2xl 4xl:text-3xl 5xl:text-4xl text-lg font-bold text-black sm:text-xl">
        {title}
      </h3>
      <p className="text-zinc-550 3xl:mt-4 3xl:text-lg 3xl:max-w-xl 4xl:mt-5 4xl:text-xl 4xl:max-w-2xl 5xl:mt-6 5xl:text-2xl 5xl:max-w-4xl mt-2 max-w-md text-sm leading-relaxed sm:text-base">
        {description}
      </p>
      <button
        onClick={handleRetry}
        disabled={isRetrying}
        className="3xl:mt-8 3xl:px-8 3xl:py-3.5 3xl:text-sm 3xl:gap-3 4xl:mt-10 4xl:px-10 4xl:py-4.5 4xl:text-base 4xl:gap-3.5 5xl:mt-14 5xl:px-14 5xl:py-6 5xl:text-lg 5xl:gap-4 mt-6 inline-flex items-center gap-2 rounded-full border border-black bg-black px-6 py-2.5 text-xs font-bold tracking-wider text-white uppercase transition-all duration-300 hover:bg-zinc-900 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-[3px] disabled:opacity-50"
      >
        <RefreshCw
          className={`h-3.5 w-3.5 ${isRetrying ? "animate-spin" : ""} 3xl:h-4.5 3xl:w-4.5 4xl:h-5 4xl:w-5 5xl:h-6 5xl:w-6`}
        />
        <span>{isRetrying ? "Retrying..." : "Retry Connection"}</span>
      </button>
    </div>
  );
}
