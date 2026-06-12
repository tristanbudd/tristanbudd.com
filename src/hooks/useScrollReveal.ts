/**
 * @file useScrollReveal.ts
 * @description Shared hook for scroll-triggered reveal animations.
 */

"use client";

import { useEffect, useRef, useState } from "react";

interface Options {
  threshold?: number;
}

function isBackForwardNav(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const entries = window.performance?.getEntriesByType?.("navigation") ?? [];
    if (entries.length > 0) {
      return (entries[0] as PerformanceNavigationTiming).type === "back_forward";
    }
    return window.performance?.navigation?.type === 2;
  } catch {
    return false;
  }
}

export function useScrollReveal<T extends HTMLElement = HTMLElement>(options: Options = {}) {
  const { threshold = 0.1 } = options;
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const show = () => setVisible(true);

    // If back/forward navigation is detected, reveal immediately.
    if (isBackForwardNav()) {
      const frame = requestAnimationFrame(show);
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);

    // bfcache restore fallback: Components do not remount on bfcache restore
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        show();
      }
    };
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      observer.disconnect();
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [threshold]);

  return { ref, visible };
}
