"use client";

/**
 * @file Experience.tsx
 * @description Reusable timeline component for work experience and volunteering history.
 */

import { Calendar, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatDuration } from "../lib/utils";

export interface ExperienceItem {
  role: string;
  organization: string;
  location?: string;
  startDate: Date;
  endDate: Date;
  dateString: string;
  descriptionPoints: string[];
  logoPath: string;
  url?: string;
}

interface ExperienceProps {
  items: ExperienceItem[];
  title: string;
  subtitle?: string;
}

function ExperienceItemRow({
  item,
  visible,
  delay,
  isLast,
}: {
  item: ExperienceItem;
  visible: boolean;
  delay: number;
  isLast: boolean;
}) {
  const duration = formatDuration(item.startDate, item.endDate);

  return (
    <div
      className="group relative pl-16 transition-all duration-500 ease-out sm:pl-20"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(24px)" : "translateY(24px)",
      }}
      ref={(el) => {
        if (el && visible) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          el.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`;
        }
      }}
    >
      {/* Vertical Line Segment */}
      {isLast ? (
        <div className="absolute top-12 bottom-0 left-6 z-0 w-0.5 bg-linear-to-b from-zinc-200 to-transparent sm:top-14 sm:left-7" />
      ) : (
        <div className="absolute top-0 bottom-0 left-6 z-0 w-0.5 bg-zinc-200 sm:left-7" />
      )}

      {/* Icon Circle Sitting on the Line */}
      <div className="absolute top-0.5 left-0 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-xs transition-all duration-300 group-hover:border-zinc-400 group-hover:shadow-md sm:h-14 sm:w-14">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.logoPath}
          alt={item.organization}
          width={28}
          height={28}
          className="h-6 w-6 object-contain transition-all duration-300 group-hover:scale-110 sm:h-7 sm:w-7"
          style={{
            filter: "grayscale(1) brightness(0) opacity(0.75)",
          }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      {/* Content wrapper */}
      <div className="flex flex-col gap-1.5 pb-12 group-last:pb-0">
        {/* Date & Badge Row */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold tracking-wider text-zinc-500 uppercase sm:text-sm">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-zinc-400 sm:h-4 sm:w-4" />
            <span>{item.dateString}</span>
          </div>

          <span className="hidden font-normal text-zinc-300 sm:inline">•</span>
          <span className="text-zinc-650 inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50/50 px-2.5 py-0.5 text-[0.7rem] font-bold tracking-wider uppercase sm:text-xs">
            {duration}
          </span>
        </div>

        {/* Role Title */}
        <h3 className="text-lg leading-tight font-extrabold tracking-tight text-black sm:text-2xl lg:text-3xl">
          {item.role}
        </h3>

        {/* Company & Location Link */}
        <div>
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link text-zinc-550 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-300 hover:text-black sm:text-base lg:text-lg"
            >
              <span>{item.organization}</span>
              {item.location && (
                <span className="font-normal text-zinc-400">| {item.location}</span>
              )}
              <ExternalLink className="h-3.5 w-3.5 text-zinc-400 transition-colors duration-300 group-hover/link:text-black sm:h-4 sm:w-4 lg:h-4.5 lg:w-4.5" />
            </a>
          ) : (
            <div className="text-zinc-550 text-sm font-semibold sm:text-base lg:text-lg">
              <span>{item.organization}</span>
              {item.location && (
                <span className="font-normal text-zinc-400"> | {item.location}</span>
              )}
            </div>
          )}
        </div>

        {/* Bullet Points */}
        <ul className="text-zinc-650 mt-3 space-y-2 text-sm leading-relaxed sm:text-base">
          {item.descriptionPoints.map((point, idx) => (
            <li
              key={idx}
              className="relative pl-5 before:absolute before:top-[0.6em] before:left-0 before:h-1.5 before:w-1.5 before:rounded-full before:bg-zinc-400"
            >
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Experience({ items = [], title, subtitle }: ExperienceProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!items.length) return null;

  return (
    <section
      aria-label={title}
      className="font-outfit 3xl:scroll-mt-36 3xl:py-24 w-full scroll-mt-24 py-12 transition-all duration-500 ease-in-out sm:scroll-mt-28 sm:py-16"
    >
      <div className="flex flex-col gap-10">
        {/* Section Title */}
        <div className="flex flex-col gap-2 text-center md:text-left">
          {subtitle && (
            <span className="3xl:text-sm text-xs font-bold tracking-widest text-zinc-500 uppercase">
              {subtitle}
            </span>
          )}
          <h2 className="3xl:text-5xl text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
            {title}
          </h2>
        </div>

        {/* Timeline Track Container */}
        <div ref={ref} className="relative ml-2 md:ml-6">
          {/* Timeline Items */}
          <div className="space-y-0">
            {items.map((item, idx) => (
              <ExperienceItemRow
                key={item.organization + item.role}
                item={item}
                visible={visible}
                delay={idx * 200}
                isLast={idx === items.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
