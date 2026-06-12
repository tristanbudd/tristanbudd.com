/**
 * @file TransitionContext.tsx
 * @description Context provider for managing custom page transition states.
 * Handles resetting transitions on route changes, popstate events, and pageshow restores.
 */

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface TransitionContextType {
  transitionTarget: string | null;
  setTransitionTarget: (target: string | null) => void;
  triggerTransition: (href: string) => boolean;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [transitionTarget, setTransitionTarget] = useState<string | null>(null);
  const pathname = usePathname();

  // Reset transition target on route change
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setTransitionTarget(null);
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  // Reset transition target on browser history navigation (back/forward or bfcache restore)
  useEffect(() => {
    const checkBackForward = () => {
      const navEntries = window.performance?.getEntriesByType?.("navigation") ?? [];
      const isBackForward =
        navEntries.length > 0
          ? (navEntries[0] as PerformanceNavigationTiming).type === "back_forward"
          : window.performance?.navigation?.type === 2;
      if (isBackForward) {
        setTransitionTarget(null);
      }
    };
    checkBackForward();

    const handlePopState = () => {
      setTransitionTarget(null);
    };
    const handlePageShow = () => {
      setTransitionTarget(null);
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  const triggerTransition = (href: string): boolean => {
    const isHash = href.startsWith("#") || (href.includes("#") && href.split("#")[0] === pathname);
    const isExternal =
      href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel");

    if (isHash || isExternal || href === "#") {
      return false;
    }

    if (transitionTarget) return true;
    setTransitionTarget(href);
    setTimeout(() => {
      if (href === "refresh") {
        window.location.reload();
      } else {
        window.location.href = href;
      }
    }, 800);
    return true;
  };

  return (
    <TransitionContext.Provider
      value={{ transitionTarget, setTransitionTarget, triggerTransition }}
    >
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("useTransition must be used within a TransitionProvider");
  }
  return context;
}
