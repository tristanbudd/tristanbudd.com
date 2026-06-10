"use client";

/**
 * @file StatsPanel.tsx
 * @description Glassmorphic statistics grid display with smooth viewport-triggered count-up animations.
 */

import { useEffect, useRef, useState } from "react";
import { formatCompactNumber } from "../lib/utils";

export interface StatItem {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  approximate?: boolean;
  animate?: boolean;
  duration?: number;
  decimals?: number;
  unit?: string;
}

export interface StatsPanelProps {
  stats: StatItem[];
  title?: string;
  subtitle?: string;
  animate?: boolean;
}

function CountUp({
  value,
  duration = 2000,
  animate = true,
  decimals,
  unit,
}: {
  value: number;
  duration?: number;
  animate?: boolean;
  decimals?: number;
  unit?: string;
}) {
  const [count, setCount] = useState(animate ? 0 : value);
  const [isCompleted, setIsCompleted] = useState(!animate);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!animate) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTime: number | null = null;

          const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

          const animateFrame = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutCubic(progress);

            setCount(easedProgress * value);

            if (progress < 1) {
              requestAnimationFrame(animateFrame);
            } else {
              setCount(value);
              setIsCompleted(true);
            }
          };

          requestAnimationFrame(animateFrame);
        }
      },
      { threshold: 0.1 }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
      observer.disconnect();
    };
  }, [value, duration, animate]);

  // Dynamic formatting logic combining manual overrides and shared auto-formatting
  const getDisplayValue = () => {
    if (isCompleted) {
      if (unit !== undefined) {
        return {
          value: decimals !== undefined ? value.toFixed(decimals) : value.toString(),
          suffix: unit,
        };
      }
      const compact = formatCompactNumber(value);
      return {
        value: decimals !== undefined ? value.toFixed(decimals) : compact.value,
        suffix: compact.suffix,
      };
    }

    // High frame-rate format during count-up animation
    if (unit !== undefined) {
      return {
        value: count.toFixed(decimals !== undefined ? decimals : 0),
        suffix: unit,
      };
    }

    const absTarget = Math.abs(value);
    if (absTarget >= 1e9) {
      const targetHasDecimal = (value / 1e9) % 1 !== 0;
      const dec = decimals !== undefined ? decimals : targetHasDecimal ? 2 : 0;
      return { value: (count / 1e9).toFixed(dec), suffix: "B" };
    }
    if (absTarget >= 1e6) {
      const targetHasDecimal = (value / 1e6) % 1 !== 0;
      const dec = decimals !== undefined ? decimals : targetHasDecimal ? 2 : 0;
      return { value: (count / 1e6).toFixed(dec), suffix: "M" };
    }
    if (absTarget >= 1e3) {
      const targetHasDecimal = (value / 1e3) % 1 !== 0;
      const dec = decimals !== undefined ? decimals : targetHasDecimal ? 2 : 0;
      return { value: (count / 1e3).toFixed(dec), suffix: "k" };
    }

    // For numbers below 1000
    const targetHasDecimal = value % 1 !== 0;
    const dec = decimals !== undefined ? decimals : targetHasDecimal ? 1 : 0;
    if (dec > 0) {
      return { value: count.toFixed(dec), suffix: "" };
    }
    return { value: Math.round(count).toString(), suffix: "" };
  };

  const formatted = getDisplayValue();

  return (
    <span ref={elementRef} className="tabular-nums">
      {formatted.value}
      {formatted.suffix && (
        <span className="text-zinc-650 ml-0.5 text-2xl font-bold sm:text-3xl">
          {formatted.suffix}
        </span>
      )}
    </span>
  );
}

export default function StatsPanel({
  stats,
  title,
  subtitle,
  animate: panelAnimate = true,
}: StatsPanelProps) {
  if (!stats || stats.length === 0) return null;

  return (
    <section
      aria-label="Statistics Panel"
      className="font-outfit w-full py-12 transition-all duration-500 ease-in-out sm:py-16"
    >
      <div className="mx-auto flex flex-col gap-10">
        {(title || subtitle) && (
          <div className="flex flex-col gap-2 text-center md:text-left">
            {subtitle && (
              <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
                {subtitle}
              </span>
            )}
            {title && (
              <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
                {title}
              </h2>
            )}
          </div>
        )}

        <div
          className={`grid gap-6 ${
            stats.length === 1
              ? "grid-cols-1"
              : stats.length === 2
                ? "grid-cols-1 sm:grid-cols-2"
                : stats.length === 3
                  ? "grid-cols-1 md:grid-cols-3"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          }`}
        >
          {stats.map((stat, idx) => {
            // Item-level animate overrides panel-level animate
            const shouldAnimate = stat.animate !== undefined ? stat.animate : panelAnimate;

            return (
              <div
                key={`${stat.label}-${idx}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/60 bg-white/40 p-8 shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:bg-white/80 hover:shadow-md"
              >
                {/* Top Accent Gradient Border */}
                <div className="absolute top-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r from-zinc-700 via-black to-zinc-800 transition-transform duration-300 group-hover:scale-x-100" />

                <div className="flex flex-col gap-3">
                  <div className="flex items-baseline text-4xl font-extrabold tracking-tight text-black sm:text-5xl">
                    {stat.prefix && (
                      <span className="mr-1 text-2xl font-bold text-zinc-400 sm:text-3xl">
                        {stat.prefix}
                      </span>
                    )}
                    <CountUp
                      value={stat.value}
                      duration={stat.duration || 2000}
                      animate={shouldAnimate}
                      decimals={stat.decimals}
                      unit={stat.unit}
                    />
                    {(stat.suffix || stat.approximate) && (
                      <span className="text-zinc-650 ml-1 text-2xl font-bold sm:text-3xl">
                        {stat.suffix || ""}
                        {stat.approximate && "+"}
                      </span>
                    )}
                  </div>

                  <div className="text-sm leading-relaxed font-semibold tracking-wider text-zinc-600 uppercase">
                    {stat.label}
                  </div>
                </div>

                {/* Decorative Subtle Icon Background Element */}
                <div className="pointer-events-none absolute -right-6 -bottom-6 text-9xl font-black text-zinc-100/30 transition-transform duration-300 ease-out select-none group-hover:translate-x-1 group-hover:translate-y-1 group-hover:scale-105">
                  0{idx + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
