"use client";

/**
 * @file page.tsx
 * @description Accessible admin login interface featuring a GitHub authenticating trigger.
 */

import { AlertCircle, ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const errorType = searchParams.get("error");

  // Map url query error parameters to readable and accessible warning messages
  const getErrorMessage = () => {
    if (!errorType) return null;
    switch (errorType) {
      case "unauthorized":
        return {
          title: "Authentication Required",
          description: "Please sign in to access the administrator panel.",
          type: "warning",
        };
      case "denied":
        return {
          title: "Access Denied",
          description:
            "Only the owner account (tristanbudd) is permitted to access the admin dashboard.",
          type: "error",
        };
      default:
        return {
          title: "Authentication Failed",
          description: `An unexpected authentication error occurred (${errorType}). Please try again.`,
          type: "error",
        };
    }
  };

  const alert = getErrorMessage();

  const handleLogin = () => {
    window.location.href = "/api/admin/auth/login";
  };

  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200/60 bg-white/40 p-8 shadow-xs backdrop-blur-md sm:p-10">
      {/* Accent Bar */}
      <div className="absolute top-0 left-0 h-[3px] w-full bg-linear-to-r from-zinc-700 via-black to-zinc-800" />

      {/* Back Link */}
      <Link
        href="/"
        className="group mb-6 inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 transition-colors hover:text-black"
        aria-label="Back to home"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        <span>Return Home</span>
      </Link>

      <div className="flex flex-col items-center text-center">
        {/* Brand Logo consistent with maintenance page */}
        <div className="mb-8 select-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 736 708"
            fill="none"
            className="h-14 w-auto text-black"
          >
            <g clipPath="url(#m_clip)">
              <path d="M466 120H293V708H171V120H0V0H466V120Z" fill="currentColor" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M736 607L635 708H328V156H450V294H570L614 250V158L577 120H502V0H635L736 101V294L674 354L736 414V607ZM450 414V588H577L614 550V458L570 414H450Z"
                fill="currentColor"
              />
            </g>
            <defs>
              <clipPath id="m_clip">
                <rect width="736" height="708" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>

        {/* Text */}
        <h1 className="font-outfit text-2xl font-extrabold tracking-tight text-black sm:text-3xl">
          Admin Portal
        </h1>
        <p className="text-zinc-650 mt-2 text-sm">Access is restricted to this section.</p>

        {alert && (
          <div
            role="alert"
            className={`mt-6 flex w-full items-start gap-3.5 rounded-xl border-2 border-black bg-white p-4 text-left shadow-xs transition-all`}
          >
            <div className="mt-0.5 shrink-0">
              {alert.type === "error" ? (
                <ShieldAlert className="h-5 w-5 text-black" />
              ) : (
                <AlertCircle className="h-5 w-5 text-black" />
              )}
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="text-sm font-bold tracking-tight text-zinc-900">{alert.title}</h3>
              <p className="text-xs leading-relaxed font-semibold text-zinc-600">
                {alert.description}
              </p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleLogin}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-zinc-800 focus:ring-2 focus:ring-black focus:ring-offset-2 focus:outline-hidden"
          aria-label="Sign in with GitHub credentials"
        >
          {/* GitHub SVG Brand Icon */}
          <svg
            className="h-5 w-5 fill-current"
            viewBox="0 0 24 24"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.867 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
            />
          </svg>
          <span>Sign in with GitHub</span>
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-6 font-sans antialiased selection:bg-black selection:text-white">
      {/* Visual background accents */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 animate-pulse rounded-full bg-zinc-100/40 blur-3xl" />
      <div
        className="bg-zinc-150/40 absolute right-1/4 bottom-1/4 -z-10 h-72 w-72 animate-pulse rounded-full blur-3xl"
        style={{ animationDelay: "2s" }}
      />
      <Suspense
        fallback={
          <div className="flex h-32 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-black border-t-transparent" />
          </div>
        }
      >
        <LoginContent />
      </Suspense>
    </div>
  );
}
