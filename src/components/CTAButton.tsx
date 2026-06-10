"use client";

/**
 * @file CTAButton.tsx
 * @description Reusable Call-to-Action (CTA) Button component with sliding-white-background hover state and responsive sizing styles.
 */

import { ArrowRight } from "lucide-react";
import React from "react";

export interface CTAButtonProps {
  text: string;
  href: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function CTAButton({ text, href, className = "", onClick }: CTAButtonProps) {
  const baseClass =
    "group/btn relative flex items-center justify-between gap-4 overflow-hidden rounded-full border-2 border-black bg-black py-1.5 pr-1.5 pl-6 text-sm font-semibold text-white shadow-xs transition-all duration-300 hover:text-black focus-visible:text-black focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black 3xl:py-2 3xl:pr-2 3xl:pl-8 3xl:text-base 4xl:py-2.5 4xl:pr-2.5 4xl:pl-10 4xl:text-lg 5xl:py-3 5xl:pr-3 5xl:pl-12 5xl:text-xl";

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <a
      href={href}
      className={`${baseClass} ${className}`}
      onClick={onClick}
      onContextMenu={handleContextMenu}
      aria-label={`Navigate to ${text}`}
    >
      {/* Sliding background */}
      <span className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-300 ease-out group-hover/btn:scale-x-100 group-focus-visible/btn:scale-x-100" />

      <span className="relative z-10 whitespace-nowrap transition-colors duration-300">{text}</span>
      <div className="3xl:h-10 3xl:w-10 4xl:h-12 4xl:w-12 5xl:h-14 5xl:w-14 relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-white transition-colors duration-300 group-hover/btn:bg-black group-focus-visible/btn:bg-black">
        <ArrowRight className="3xl:h-5 3xl:w-5 4xl:h-6 4xl:w-6 5xl:h-7 5xl:w-7 h-4 w-4 transition-all duration-300 group-hover/btn:-rotate-45 group-focus-visible/btn:-rotate-45" />
      </div>
    </a>
  );
}
