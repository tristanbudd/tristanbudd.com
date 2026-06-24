"use client";

/**
 * @file BackButton.tsx
 * @description Reusable, responsive glassmorphic back button.
 */

import { ArrowLeft, Rss } from "lucide-react";
import Link from "next/link";
import { useTransition } from "../context/TransitionContext";

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
  variant?: "default" | "rss";
}

export default function BackButton({
  href = "/",
  label = "Back to Home",
  className = "",
  variant = "default",
}: BackButtonProps) {
  const { triggerTransition } = useTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Skip hijack for external links or RSS feed file links
    if (variant === "rss" || href.startsWith("http") || href.endsWith(".xml")) {
      return;
    }
    e.preventDefault();
    triggerTransition(href);
  };

  const isRss = variant === "rss";
  const icon = isRss ? (
    <Rss className="3xl:h-5 3xl:w-5 4xl:h-6 4xl:w-6 5xl:h-7 5xl:w-7 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
  ) : (
    <ArrowLeft className="3xl:h-5 3xl:w-5 4xl:h-6 4xl:w-6 5xl:h-7 5xl:w-7 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
  );

  const styleClass = isRss
    ? "text-white bg-black border-black hover:bg-white hover:text-black hover:border-black"
    : "text-zinc-650 bg-white/60 border-zinc-200 hover:border-zinc-400 hover:bg-white hover:text-black";

  return (
    <Link
      href={href}
      onClick={handleClick}
      target={isRss ? "_blank" : undefined}
      rel={isRss ? "noopener noreferrer" : undefined}
      aria-label={label}
      className={`group 3xl:gap-3 3xl:px-7 3xl:py-3.5 3xl:text-base 4xl:px-9 4xl:py-4.5 4xl:text-lg 5xl:px-11 5xl:py-5.5 5xl:text-xl 3xl:border-2 4xl:border-[2.5px] 5xl:border-[3px] inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold shadow-xs backdrop-blur-xs transition-all duration-300 hover:shadow-sm ${styleClass} ${className}`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
