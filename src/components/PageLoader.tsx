"use client";

/**
 * @file PageLoader.tsx
 * @description Dynamic, motion-focused page load animation based on Tristan's stylized logo.
 */

import { useEffect, useState } from "react";

function getInitialStatus(): "loading" | "complete" {
  if (typeof window === "undefined") {
    return "loading";
  }

  try {
    const navEntries = window.performance?.getEntriesByType?.("navigation") ?? [];

    const isBackForward =
      navEntries.length > 0
        ? (navEntries[0] as PerformanceNavigationTiming).type === "back_forward"
        : window.performance?.navigation?.type === 2;

    return isBackForward ? "complete" : "loading";
  } catch {
    return "loading";
  }
}

export default function PageLoader() {
  const [status, setStatus] = useState<"loading" | "complete">(getInitialStatus);

  useEffect(() => {
    if (status === "complete") {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const scrollTimer = window.setTimeout(() => {
      document.body.style.overflow = "";
    }, 1000);

    const completeTimer = window.setTimeout(() => {
      setStatus("complete");
    }, 1650);

    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(completeTimer);
      document.body.style.overflow = "";
    };
  }, [status]);

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        document.body.style.overflow = "";
        setStatus("complete");

        window.dispatchEvent(new CustomEvent("page-restored-from-bfcache"));
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  if (status === "complete") {
    return null;
  }

  return (
    <div
      className="animate-loader-slide-up fixed inset-0 flex flex-col items-center justify-center bg-white"
      style={{
        zIndex: 9999,
      }}
    >
      {/* Inject custom CSS keyframes for bouncy and rotation movements */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes loader-collide-t {
          0% {
            opacity: 0;
            transform: translateX(-25vw) scale(0.8);
          }
          70% {
            transform: translateX(1.5vw) scale(1.05);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes loader-collide-b {
          0% {
            opacity: 0;
            transform: translateX(25vw) scale(0.8);
          }
          70% {
            transform: translateX(-1.5vw) scale(1.05);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes loader-spin-logo {
          0% {
            transform: rotate(0deg) scale(1);
          }
          45% {
            transform: rotate(-12deg) scale(1.18);
          }
          70% {
            transform: rotate(4deg) scale(0.96);
          }
          100% {
            transform: rotate(0deg) scale(1);
          }
        }
        @keyframes loader-slide-up-text {
          0% {
            opacity: 0;
            transform: translateY(100%);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes loader-expand-bar {
          0% {
            transform: scaleX(0);
          }
          100% {
            transform: scaleX(1);
          }
        }
        @keyframes loader-slide-up {
          0% {
            transform: translateY(0);
            pointer-events: auto;
          }
          99% {
            transform: translateY(-100%);
            pointer-events: auto;
          }
          100% {
            transform: translateY(-100%);
            pointer-events: none;
          }
        }
        
        .animate-loader-t {
          animation: loader-collide-t 0.55s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .animate-loader-b {
          animation: loader-collide-b 0.55s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .animate-loader-spin {
          animation: loader-spin-logo 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s forwards;
        }
        .animate-loader-text-mask {
          animation: loader-slide-up-text 0.55s cubic-bezier(0.25, 1, 0.5, 1) 0.6s forwards;
        }
        .animate-loader-bar {
          animation: loader-expand-bar 1.0s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .animate-loader-slide-up {
          animation: loader-slide-up 0.65s cubic-bezier(0.85, 0, 0.15, 1) 1.0s forwards;
        }
      `,
        }}
      />

      <div className="3xl:gap-10 4xl:gap-14 5xl:gap-18 flex flex-col items-center gap-6">
        {/* Logo container that rotates and scales */}
        <div className="animate-loader-spin origin-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 736 708"
            fill="none"
            className="3xl:h-32 4xl:h-40 5xl:h-48 h-16 w-auto text-black sm:h-20"
          >
            <g clipPath="url(#loader_clip)">
              {/* Left Path ("T") - Collides from left */}
              <path
                d="M466 120H293V708H171V120H0V0H466V120Z"
                fill="currentColor"
                className="animate-loader-t origin-center opacity-0"
              />
              {/* Right Path ("B") - Collides from right */}
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M736 607L635 708H328V156H450V294H570L614 250V158L577 120H502V0H635L736 101V294L674 354L736 414V607ZM450 414V588H577L614 550V458L570 414H450Z"
                fill="currentColor"
                className="animate-loader-b origin-center opacity-0"
              />
            </g>
            <defs>
              <clipPath id="loader_clip">
                <rect width="736" height="708" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>

        {/* Brand Name Text with overflow clipping mask */}
        <div className="3xl:h-12 4xl:h-16 5xl:h-20 h-7 overflow-hidden sm:h-8">
          <div className="font-outfit animate-loader-text-mask flex items-center justify-center opacity-0">
            <span className="3xl:text-4xl 4xl:text-5xl 5xl:text-6xl text-lg font-black tracking-[0.25em] text-black uppercase sm:text-xl">
              Tristan Budd
            </span>
          </div>
        </div>

        {/* Minimal loading progress line indicator */}
        <div className="3xl:h-[3px] 3xl:w-44 3xl:mt-4 4xl:h-[4px] 4xl:w-56 4xl:mt-6 5xl:h-[5px] 5xl:w-72 5xl:mt-8 relative mt-2 h-[2px] w-28 overflow-hidden rounded-full bg-zinc-100">
          <div className="animate-loader-bar absolute top-0 left-0 h-full w-full origin-left bg-black" />
        </div>
      </div>
    </div>
  );
}
