/**
 * @file ScrollInit.tsx
 * @description Syncs the 'is-scrolled' class on the document root (<html>) based on scroll position.
 */

"use client";

import { useEffect } from "react";

export default function ScrollInit() {
  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 10) {
        document.documentElement.classList.add("is-scrolled");
      } else {
        document.documentElement.classList.remove("is-scrolled");
      }
    };

    // Run check on initial mount
    checkScroll();

    // Listen to standard scroll events
    window.addEventListener("scroll", checkScroll, { passive: true });

    // Listen to history navigation transitions (popstate)
    window.addEventListener("popstate", checkScroll);

    // Listen to bfcache page restores (pageshow)
    window.addEventListener("pageshow", checkScroll);

    return () => {
      window.removeEventListener("scroll", checkScroll);
      window.removeEventListener("popstate", checkScroll);
      window.removeEventListener("pageshow", checkScroll);
    };
  }, []);

  return null;
}
