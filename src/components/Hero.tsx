"use client";

/**
 * @file Hero.tsx
 * @description Hero section component with main headline, responsive layout, smooth-scroll CTA, and interactive orbital profile card.
 */

import Image from "next/image";
import React from "react";
import CTAButton from "./CTAButton";

import { languages, tools } from "../data/portfolio";

export interface HeroProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  ctaText?: string;
  ctaHref?: string;
}

// Reusable SVG Monogram Logo Watermark (No Clip-Path to prevent ID conflicts)
function WatermarkLogo({ className }: { className: string }) {
  return (
    <div className={className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 736 708"
        fill="none"
        className="h-auto w-full fill-current text-current"
      >
        <path d="M466 120H293V708H171V120H0V0H466V120Z" fill="currentColor" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M736 607L635 708H328V156H450V294H570L614 250V158L577 120H502V0H635L736 101V294L674 354L736 414V607ZM450 414V588H577L614 550V458L570 414H450Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

export default function Hero({
  title = "Lorem ipsum dolor sit amet",
  subtitle = "Consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  ctaText = "Placeholder CTA",
  ctaHref = "#",
}: HeroProps) {
  // Combine actual key skills dynamically from shared portfolio data
  const featuredSkills = [...languages, ...tools].map((skill) => skill.name);

  // Join with bullets but end with space instead of a final bullet point
  const skillsText = featuredSkills.join(" • ") + "   ";

  return (
    <section
      id="hero"
      aria-label="Introduction Hero"
      className="font-outfit 3xl:max-h-270 4xl:max-h-300 5xl:max-h-360 relative max-h-237.5 w-full overflow-hidden pt-36 pb-24 transition-colors duration-500 ease-in-out lg:flex lg:min-h-screen lg:flex-col lg:items-center lg:justify-center lg:pt-40 lg:pb-32"
    >
      {/* 3 Scattered High-Transparency Watermarks rotated and placed out of the header's way */}
      <WatermarkLogo className="3xl:h-37.5 3xl:w-37.5 4xl:h-45 4xl:w-45 5xl:h-55 5xl:w-55 pointer-events-none absolute top-[28%] left-[6%] z-0 hidden h-22.5 w-22.5 rotate-[-15deg] text-zinc-950 opacity-[0.018] select-none sm:block lg:h-27.5 lg:w-27.5" />
      <WatermarkLogo className="3xl:h-45 3xl:w-45 4xl:h-55 4xl:w-55 5xl:h-70 5xl:w-70 pointer-events-none absolute right-[8%] bottom-[20%] z-0 h-18.75 w-18.75 rotate-20 text-zinc-950 opacity-[0.012] select-none sm:h-30 sm:w-30 sm:opacity-[0.022] lg:h-32.5 lg:w-32.5" />
      <WatermarkLogo className="3xl:h-40 3xl:w-40 4xl:h-47.5 4xl:w-47.5 5xl:h-60 5xl:w-60 pointer-events-none absolute bottom-[8%] left-[40%] z-0 hidden h-23.75 w-23.75 rotate-[-30deg] text-zinc-950 opacity-[0.015] select-none sm:block lg:h-28.75 lg:w-28.75" />

      <div className="3xl:max-w-340 4xl:max-w-400 5xl:max-w-500 relative z-10 mx-auto w-full max-w-6xl px-4 lg:flex lg:flex-1 lg:items-center lg:justify-center 2xl:max-w-7xl">
        <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-24">
          {/* Left Column: Heading and CTA */}
          <div className="relative z-20 order-2 flex flex-col items-center text-center lg:order-1 lg:col-span-6 lg:items-start lg:text-left">
            <h1 className="font-outfit sm:short:text-3xl 3xl:text-7xl 4xl:text-8xl 5xl:text-9xl mb-4 text-3xl leading-[1.1] font-black tracking-tight text-zinc-950 min-[360px]:mb-6 min-[360px]:text-4xl sm:text-5xl md:text-6xl">
              {title}
            </h1>
            <p className="short:mb-4 min-[360px]:short:text-sm sm:short:text-base 3xl:max-w-xl 3xl:text-xl 4xl:max-w-2xl 4xl:text-2xl 5xl:max-w-4xl 5xl:text-3xl text-zinc-655 mb-8 max-w-xl text-sm leading-relaxed min-[360px]:text-base sm:text-lg">
              {subtitle}
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <CTAButton text={ctaText} href={ctaHref} />
              <a
                href="#experience"
                className="rounded-full px-4 py-2 text-sm font-bold text-zinc-600 transition-colors duration-300 hover:text-black focus:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                View Experience
              </a>
            </div>
          </div>

          {/* Right Column: Circular Astrolabe Radar Photo (Isolates Grid Track constraints to prevent 1126px overflow) */}
          <div className="hide-on-short-mobile group relative order-1 flex w-full items-center justify-center select-none lg:order-2 lg:col-span-6 lg:justify-end">
            {/* Responsive outer container: Aspect-Square Locked to prevent distortion */}
            <div className="3xl:max-w-175 4xl:max-w-200 5xl:max-w-237.5 relative flex aspect-square w-full max-w-85 items-center justify-center sm:max-w-120 lg:mr-20 lg:-ml-20 lg:max-w-155 xl:mr-0 xl:ml-0">
              {/* Ambient decorative glow */}
              <div className="pointer-events-none absolute h-[80%] w-[80%] rounded-full bg-zinc-100/50 blur-3xl" />

              {/* Orbit Ring 3 (Outer dotted - Hidden on tiny mobile screens <= 400px) */}
              <div className="pointer-events-none absolute h-full w-full rounded-full border border-dotted border-zinc-200 max-[400px]:hidden" />

              {/* Orbit Ring 2 (Middle dashed - Hidden on tiny mobile screens <= 400px) */}
              <div className="pointer-events-none absolute h-[88%] w-[88%] rounded-full border border-dashed border-zinc-200 max-[400px]:hidden" />

              {/* Orbit Ring 1 (Inner SVG Text Orbit - Hidden on tiny mobile screens <= 400px) */}
              <svg
                viewBox="0 0 200 200"
                className="animate-orbit pointer-events-none absolute h-[78%] w-[78%] transition-transform duration-700 ease-out select-none group-hover:scale-102 max-[400px]:hidden"
              >
                <defs>
                  <path
                    id="textCircle"
                    d="M 100, 100 m -90, 0 a 90,90 0 1,1 180,0 a 90,90 0 1,1 -180,0"
                  />
                </defs>
                <text className="fill-zinc-400 font-mono text-[5.5px] font-bold tracking-[0.14em] uppercase transition-colors duration-500 group-hover:fill-zinc-800">
                  <textPath href="#textCircle" startOffset="0%">
                    {skillsText}
                  </textPath>
                </text>
              </svg>

              {/* The Photo Container (Center - Scaled up on tiny mobile screens <= 400px to make it the hero) */}
              <div className="relative aspect-square h-[64%] w-[64%] overflow-hidden rounded-full border-8 border-zinc-950 bg-white shadow-2xl max-[400px]:h-[82%] max-[400px]:w-[82%]">
                <Image
                  width={726}
                  height={726}
                  src="/tristan.jpg"
                  alt="Tristan Budd Profile"
                  className="h-full w-full rounded-full object-cover object-center"
                  loading="eager"
                  sizes="(max-width: 400px) 82vw, (max-width: 640px) 220px, (max-width: 1024px) 310px, (max-width: 1536px) 400px, 608px"
                />
                {/* Glassmorphic overlay ring */}
                <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-black/10 ring-inset" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sleek Chevron Double Scroll Down Prompt (Hidden on Mobile/Tablet to prevent layout overlaps) */}
      <div className="3xl:bottom-10 4xl:bottom-14 5xl:bottom-20 absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center lg:flex">
        <a
          href="#stats"
          className="group 3xl:text-xs 3xl:gap-2 4xl:text-sm 4xl:gap-2.5 5xl:text-base 5xl:gap-3 flex cursor-pointer flex-col items-center gap-1.5 rounded-lg text-[10px] font-bold tracking-[0.25em] text-zinc-400 uppercase transition-colors duration-300 hover:text-black focus:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          aria-label="Scroll down to content"
        >
          <span>Scroll for more</span>
          <div className="3xl:h-8 4xl:h-10 5xl:h-12 flex h-6 items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="animate-bounce-custom 3xl:h-5 3xl:w-5 4xl:h-6 4xl:w-6 5xl:h-8 5xl:w-8 h-4 w-4 fill-none stroke-current stroke-2"
            >
              <path d="M7 13l5 5 5-5" />
              <path d="M7 7l5 5 5-5" opacity="0.5" />
            </svg>
          </div>

          {/* Self-contained keyframes */}
          <style>{`
            @keyframes bounceCustom {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(4px); }
            }
            .animate-bounce-custom {
              animation: bounceCustom 1.6s ease-in-out infinite;
            }

            @keyframes orbit {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .animate-orbit {
              animation: orbit 35s linear infinite;
            }
          `}</style>
        </a>
      </div>
    </section>
  );
}
