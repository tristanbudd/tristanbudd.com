"use client";

/**
 * @file Hero.tsx
 * @description Hero section component with main headline, responsive layout, smooth-scroll CTA, and vector mountain line art.
 */

import React from "react";
import CTAButton from "./CTAButton";

export interface HeroProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  ctaText?: string;
  ctaHref?: string;
}

export default function Hero({
  title = "Lorem ipsum dolor sit amet",
  subtitle = "Consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  ctaText = "Placeholder CTA",
  ctaHref = "#",
}: HeroProps) {
  return (
    <section
      id="hero"
      aria-label="Introduction Hero"
      className="font-outfit 3xl:max-h-[1080px] 4xl:max-h-[1200px] 5xl:max-h-[1440px] relative max-h-[900px] w-full pt-36 pb-20 transition-all duration-500 ease-in-out lg:flex lg:min-h-screen lg:flex-col lg:items-center lg:justify-center lg:pt-40 lg:pb-28"
    >
      <div className="w-full lg:flex lg:flex-1 lg:items-center lg:justify-center">
        <div className="grid w-full grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Heading and CTA */}
          <div className="order-2 flex flex-col items-center text-center lg:order-1 lg:col-span-5 lg:items-start lg:text-left">
            <h1 className="font-outfit sm:short:text-3xl 3xl:text-7xl 4xl:text-8xl 5xl:text-9xl mb-4 text-3xl leading-[1.1] font-black tracking-tight text-zinc-950 min-[360px]:mb-6 min-[360px]:text-4xl sm:text-5xl md:text-6xl">
              {title}
            </h1>
            <p className="short:mb-4 min-[360px]:short:text-sm sm:short:text-base 3xl:max-w-xl 3xl:text-xl 4xl:max-w-2xl 4xl:text-2xl 5xl:max-w-4xl 5xl:text-3xl mb-8 max-w-lg text-sm leading-relaxed text-zinc-600 min-[360px]:text-base sm:text-lg">
              {subtitle}
            </p>

            <CTAButton text={ctaText} href={ctaHref} />
          </div>

          {/* Right Column: Custom Line-Art Vector Graphic */}
          <div className="hide-on-short-mobile relative order-1 mx-auto flex w-full max-w-sm items-center justify-center sm:max-w-md lg:order-2 lg:col-span-7 lg:max-w-none">
            {/* Detailed Bounding Box Placeholder */}
            <svg viewBox="0 0 800 480" className="h-auto w-full fill-none">
              {/* Basic Border */}
              <rect
                x="1"
                y="1"
                width="798"
                height="478"
                rx="6"
                className="fill-zinc-50/10 stroke-zinc-300"
                strokeWidth="1.5"
                strokeDasharray="6 4"
              />

              {/* Center Text: Resolution and Aspect Ratio */}
              <text
                x="400"
                y="240"
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-outfit fill-zinc-400 text-sm font-semibold tracking-wider"
              >
                800 × 480 (5:3 Ratio)
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
