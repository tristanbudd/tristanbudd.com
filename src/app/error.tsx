"use client";

/**
 * @file error.tsx
 * @description Consolidated error page component handling all types of error codes and routing states dynamically.
 */

import { useEffect } from "react";
import CTAButton from "../components/CTAButton";

export interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Only log actual runtime errors to console (not standard 404s)
    if (!error.message.includes("404") && error.message !== "Page not found") {
      console.error("Unhandled runtime error:", error);
    }
  }, [error]);

  const message = error.message || "";
  const is404 = message.includes("404") || message === "Page not found";
  const is403 = message.includes("403");
  const is500 = message.includes("500");

  let code = "Oops";
  let title = "Something Went Wrong";
  let description =
    "An unexpected error occurred while rendering this page. We've logged the issue and are looking into it.";

  if (is404) {
    code = "404";
    title = "Page Not Found";
    description =
      "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.";
  } else if (is403) {
    code = "403";
    title = "Access Denied";
    description = "You do not have permission to access this page.";
  } else if (is500) {
    code = "500";
    title = "Internal Server Error";
    description = "A server-side error occurred. Please try again later.";
  }

  return (
    <main
      role="main"
      className="font-outfit bg-background text-foreground relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 text-center select-none"
    >
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_0%,transparent_70%)]" />

      {/* Content wrapper */}
      <div className="relative z-10 flex max-w-md flex-col items-center">
        {/* Large dynamic status code */}
        <span className="text-foreground text-8xl leading-none font-black tracking-tight sm:text-9xl">
          {code}
        </span>

        {/* Text descriptions */}
        <div className="mt-6 mb-8 space-y-3">
          <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">{title}</h1>
          <p className="text-secondary max-w-sm text-sm leading-relaxed font-medium sm:text-base">
            {description}
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          {!is404 && !is403 && (
            <CTAButton
              text="Refresh Page"
              href="#"
              type="refresh"
              onClick={(e) => {
                e.preventDefault();
                reset();
              }}
            />
          )}
          <CTAButton text="Return to Home Page" href="/" />
        </div>
      </div>
    </main>
  );
}
