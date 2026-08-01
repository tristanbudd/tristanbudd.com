"use client";

/**
 * @file TableOfContents.tsx
 * @description A Table of Contents sidebar component with scroll spy behavior.
 */

import { Menu } from "lucide-react";
import React, { useEffect, useState } from "react";

interface HeadingItem {
  text: string;
  slug: string;
  level: number;
}

interface TableOfContentsProps {
  headings: HeadingItem[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeSlug, setActiveSlug] = useState<string>(headings[0]?.slug || "");

  useEffect(() => {
    if (headings.length === 0) return;

    const headingElements = headings.map((h) => document.getElementById(h.slug)).filter(Boolean);

    const observerOptions = {
      root: null,
      rootMargin: "-80px 0px -60% 0px", // Offset for top header and focus active zone
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      // Find the first intersecting entry from the top
      const intersectingEntries = entries.filter((entry) => entry.isIntersecting);

      if (intersectingEntries.length > 0) {
        // Sort by bounding client rect top to get the topmost intersecting element
        const topIntersecting = intersectingEntries.reduce((acc, curr) =>
          curr.target.getBoundingClientRect().top < acc.target.getBoundingClientRect().top
            ? curr
            : acc
        );
        setActiveSlug(topIntersecting.target.id);
      } else {
        // If scrolling up, active slug might be the one preceding the current elements
        const scrollPosition = window.scrollY + 100;

        let currentActive = headings[0].slug;
        for (const heading of headings) {
          const el = document.getElementById(heading.slug);
          if (el && el.offsetTop <= scrollPosition) {
            currentActive = heading.slug;
          } else {
            break;
          }
        }
        setActiveSlug(currentActive);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    headingElements.forEach((el) => {
      if (el) observer.observe(el);
    });

    // Also fallback check on scroll to make sure indicator updates correctly when scrolling rapidly
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      let currentActive = headings[0]?.slug || "";

      for (let i = 0; i < headings.length; i++) {
        const el = document.getElementById(headings[i].slug);
        if (el) {
          if (el.offsetTop <= scrollPosition) {
            currentActive = headings[i].slug;
          } else {
            break;
          }
        }
      }
      setActiveSlug((prev) => {
        if (currentActive !== prev) {
          return currentActive;
        }
        return prev;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headings]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    const el = document.getElementById(slug);
    if (el) {
      const headerOffset = 100; // Account for the sticky header height
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Update state and URL path hash
      history.pushState(null, "", `#${slug}`);
      setActiveSlug(slug);
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="3xl:p-10 4xl:p-12 5xl:p-16 rounded-2xl border border-zinc-200/60 bg-white/40 p-4 shadow-xs backdrop-blur-md sm:p-6 md:p-8">
      <div className="flex flex-col gap-3">
        <span className="3xl:text-sm 4xl:text-base 5xl:text-lg flex items-center gap-2 text-xs font-bold tracking-widest text-zinc-500 uppercase">
          <Menu className="3xl:h-5.5 3xl:w-5.5 4xl:h-6.5 4xl:w-6.5 5xl:h-7.5 5xl:w-7.5 h-4.5 w-4.5 text-zinc-500" />
          Table of Contents
        </span>

        <div className="relative mt-2 pl-0.5">
          {/* Background continuous track line */}
          <div className="absolute top-1.5 bottom-1.5 left-0 w-px bg-zinc-200/60" />

          <nav className="flex flex-col gap-1">
            {headings.map((heading) => {
              const isActive = activeSlug === heading.slug;
              return (
                <a
                  key={heading.slug}
                  href={`#${heading.slug}`}
                  onClick={(e) => handleClick(e, heading.slug)}
                  className={`group -ml-px block border-l py-1.5 transition-all duration-200 ${
                    heading.level === 3 ? "pl-6 text-xs" : "pl-3 text-sm font-semibold"
                  } ${
                    isActive
                      ? "border-black text-black"
                      : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-900"
                  }`}
                >
                  {heading.text}
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
