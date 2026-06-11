"use client";

/**
 * @file BackButton.tsx
 * @description Reusable, responsive glassmorphic back button.
 */

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export default function BackButton({
  href = "/",
  label = "Back to Home",
  className = "",
}: BackButtonProps) {
  return (
    <Link
      href={href}
      className={`group text-zinc-650 3xl:gap-3 3xl:px-7 3xl:py-3.5 3xl:text-base 4xl:px-9 4xl:py-4.5 4xl:text-lg 5xl:px-11 5xl:py-5.5 5xl:text-xl 3xl:border-2 4xl:border-[2.5px] 5xl:border-[3px] inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/60 px-4 py-2 text-sm font-semibold shadow-xs backdrop-blur-xs transition-all duration-300 hover:border-zinc-400 hover:bg-white hover:text-black hover:shadow-sm ${className}`}
    >
      <ArrowLeft className="3xl:h-5 3xl:w-5 4xl:h-6 4xl:w-6 5xl:h-7 5xl:w-7 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
      <span>{label}</span>
    </Link>
  );
}
