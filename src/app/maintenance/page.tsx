"use client";

/**
 * @file page.tsx
 * @description Screen displayed when the application is under maintenance.
 */

import { Github, Linkedin } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-6 font-sans antialiased selection:bg-black selection:text-white">
      {/* Background decoration elements */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 animate-pulse rounded-full bg-zinc-100/40 blur-3xl" />
      <div
        className="bg-zinc-150/40 absolute right-1/4 bottom-1/4 -z-10 h-72 w-72 animate-pulse rounded-full blur-3xl"
        style={{ animationDelay: "2s" }}
      />

      {/* Maintenance Card Container */}
      <div className="group relative w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200/60 bg-white/40 p-8 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-zinc-300 hover:bg-white/50 hover:shadow-md sm:p-12">
        {/* Accent Top Bar */}
        <div className="absolute top-0 left-0 h-[3px] w-full bg-linear-to-r from-zinc-700 via-black to-zinc-800" />

        <div className="flex flex-col items-center text-center">
          {/* Logo Brand Mark */}
          <div className="mb-8 select-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 736 708"
              fill="none"
              className="h-16 w-auto text-black transition-transform duration-300 group-hover:scale-105"
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

          {/* Heading */}
          <span className="font-outfit text-xs font-bold tracking-widest text-zinc-500 uppercase">
            Temporary Offline
          </span>
          <h1 className="font-outfit mt-3 mb-4 text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
            System Upgrades
          </h1>

          {/* Explanation */}
          <p className="text-zinc-650 text-base leading-relaxed">
            The tristanbudd.com website is temporarily offline while we carry out scheduled system
            improvements. We expect to be back online shortly. Thank you for your patience.
          </p>

          {/* Social Links */}
          <div className="border-zinc-150/50 mt-8 flex w-full items-center justify-center gap-6 border-t pt-6">
            <a
              href="https://github.com/tristanbudd"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-zinc-500 transition-colors hover:text-black"
              aria-label="GitHub Profile"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/tristanbudd"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-zinc-500 transition-colors hover:text-black"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="h-4 w-4" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
