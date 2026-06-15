import { ArrowRight, RotateCw, Plus } from "lucide-react";
import React from "react";
import { useTransition } from "../context/TransitionContext";
import { trackCTA } from "@/lib/gtm";

export interface CTAButtonProps {
  text: string;
  href?: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  type?: "default" | "refresh" | "load-more";
}

export default function CTAButton({
  text,
  href,
  className = "",
  onClick,
  type = "default",
}: CTAButtonProps) {
  const baseClass =
    "group/btn relative flex items-center justify-between gap-4 overflow-hidden rounded-full border-2 border-black 3xl:border-[3px] 4xl:border-[4px] 5xl:border-[5px] bg-black py-1.5 pr-1.5 pl-6 text-sm font-semibold text-white shadow-xs transition-colors duration-300 hover:text-black focus-visible:text-black focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black 3xl:py-2 3xl:pr-2 3xl:pl-8 3xl:text-base 4xl:py-2.5 4xl:pr-2.5 4xl:pl-10 4xl:text-lg 5xl:py-3 5xl:pr-3 5xl:pl-12 5xl:text-xl";

  const { triggerTransition } = useTransition();

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackCTA(text, href);
    if (onClick) {
      onClick(e);
      if (e.isDefaultPrevented()) return;
    }
    if (href) {
      const triggered = triggerTransition(href);
      if (triggered) {
        e.preventDefault();
      }
    }
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    trackCTA(text);
    if (onClick) {
      onClick(e);
    }
  };

  if (!href) {
    return (
      <button
        type="button"
        className={`${baseClass} ${className}`}
        onClick={handleButtonClick}
        onContextMenu={handleContextMenu}
        aria-label={text}
      >
        {/* Sliding background */}
        <span className="absolute inset-0 origin-left scale-x-0 rounded-full bg-white transition-transform duration-300 ease-out group-hover/btn:scale-x-100 group-focus-visible/btn:scale-x-100" />

        <span className="relative z-10 whitespace-nowrap transition-colors duration-300">
          {text}
        </span>
        <div className="3xl:h-10 3xl:w-10 4xl:h-12 4xl:w-12 5xl:h-14 5xl:w-14 relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-white transition-colors duration-300 group-hover/btn:bg-black group-focus-visible/btn:bg-black">
          {type === "load-more" ? (
            <Plus className="3xl:h-5 3xl:w-5 4xl:h-6 4xl:w-6 5xl:h-7 5xl:w-7 h-4 w-4 transition-all duration-300 group-hover/btn:rotate-90 group-focus-visible/btn:rotate-90" />
          ) : type === "refresh" ? (
            <RotateCw className="3xl:h-5 3xl:w-5 4xl:h-6 4xl:w-6 5xl:h-7 5xl:w-7 h-4 w-4 transition-all duration-500 group-hover/btn:rotate-360 group-focus-visible/btn:rotate-360" />
          ) : (
            <ArrowRight className="3xl:h-5 3xl:w-5 4xl:h-6 4xl:w-6 5xl:h-7 5xl:w-7 h-4 w-4 transition-all duration-300 group-hover/btn:-rotate-45 group-focus-visible/btn:-rotate-45" />
          )}
        </div>
      </button>
    );
  }

  return (
    <a
      href={href}
      className={`${baseClass} ${className}`}
      onClick={handleLinkClick}
      onContextMenu={handleContextMenu}
      aria-label={`Navigate to ${text}`}
    >
      {/* Sliding background */}
      <span className="absolute inset-0 origin-left scale-x-0 rounded-full bg-white transition-transform duration-300 ease-out group-hover/btn:scale-x-100 group-focus-visible/btn:scale-x-100" />

      <span className="relative z-10 whitespace-nowrap transition-colors duration-300">{text}</span>
      <div className="3xl:h-10 3xl:w-10 4xl:h-12 4xl:w-12 5xl:h-14 5xl:w-14 relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-white transition-colors duration-300 group-hover/btn:bg-black group-focus-visible/btn:bg-black">
        {type === "load-more" ? (
          <Plus className="3xl:h-5 3xl:w-5 4xl:h-6 4xl:w-6 5xl:h-7 5xl:w-7 h-4 w-4 transition-all duration-300 group-hover/btn:rotate-90 group-focus-visible/btn:rotate-90" />
        ) : type === "refresh" ? (
          <RotateCw className="3xl:h-5 3xl:w-5 4xl:h-6 4xl:w-6 5xl:h-7 5xl:w-7 h-4 w-4 transition-all duration-500 group-hover/btn:rotate-360 group-focus-visible/btn:rotate-360" />
        ) : (
          <ArrowRight className="3xl:h-5 3xl:w-5 4xl:h-6 4xl:w-6 5xl:h-7 5xl:w-7 h-4 w-4 transition-all duration-300 group-hover/btn:-rotate-45 group-focus-visible/btn:-rotate-45" />
        )}
      </div>
    </a>
  );
}
