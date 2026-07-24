/**
 * @file ScrollInit.tsx
 * @description Syncs the 'is-scrolled' class on the document root (<html>) based on scroll position and manages global accessibility focus redirects for hash links.
 */

"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";

export default function ScrollInit() {
  const lenis = useLenis();

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

    // Shift focus on initial mount if there is a hash in the URL
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      const targetElement = document.getElementById(hash);
      if (targetElement) {
        setTimeout(() => {
          targetElement.setAttribute("tabindex", "-1");
          targetElement.focus({ preventScroll: true });
        }, 500);
      }
    }

    // Global intercept for hash links to manage keyboard focus redirection
    const handleHashLinkClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      if (!href.includes("#")) return;

      const [path, hash] = href.split("#");
      const isCurrentPage =
        !path ||
        path === "/" ||
        path === window.location.pathname ||
        (path === "" && window.location.pathname === "/");

      if (isCurrentPage && hash) {
        const targetElement = document.getElementById(hash);
        if (targetElement) {
          e.preventDefault();

          if (lenis) {
            lenis.scrollTo(targetElement, { duration: 1.2 });
          } else {
            targetElement.scrollIntoView({ behavior: "smooth" });
          }

          targetElement.setAttribute("tabindex", "-1");
          targetElement.focus({ preventScroll: true });

          window.history.pushState(null, "", `#${hash}`);
        }
      }
    };

    document.addEventListener("click", handleHashLinkClick);

    return () => {
      window.removeEventListener("scroll", checkScroll);
      window.removeEventListener("popstate", checkScroll);
      window.removeEventListener("pageshow", checkScroll);
      document.removeEventListener("click", handleHashLinkClick);
    };
  }, [lenis]);

  return null;
}
