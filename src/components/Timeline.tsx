"use client";

/**
 * @file Timeline.tsx
 * @description Consolidated, highly responsive timeline component for Work Experience, Education, and Volunteering.
 */

import { Calendar, ExternalLink } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export interface TimelineItem {
  title: string; // e.g. "Software Engineer" or "Honours Degree in Software Engineering"
  subtitle: string; // e.g. "Google" or "University of Portsmouth"
  location?: string; // e.g. "London, UK" or "School of Computing"
  dateString: string; // e.g. "September 2024 - July 2028"
  badgeText?: string; // e.g. duration like "1 yr 10 mos" or details like "Ongoing" or "Distinction"
  logoPath: string;
  url?: string; // Optional URL to organization/course website
  points?: string[]; // Optional bullet points (used for experience/volunteering description)
}

interface TimelineProps {
  items: TimelineItem[];
  title: string;
  subtitle?: string;
  id?: string;
}

function TimelineItemRow({
  item,
  visible,
  delay,
  isLast,
}: {
  item: TimelineItem;
  visible: boolean;
  delay: number;
  isLast: boolean;
}) {
  return (
    <div
      className="group 3xl:pl-24 4xl:pl-28 5xl:pl-32 relative pl-16 transition-all duration-500 ease-out sm:pl-20"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {/* Vertical Line Segment */}
      {isLast ? (
        <div className="3xl:top-16 3xl:left-8 4xl:top-20 4xl:left-10 5xl:top-24 5xl:left-12 absolute top-12 bottom-0 left-6 z-0 w-0.5 bg-linear-to-b from-zinc-200 to-transparent sm:top-14 sm:left-7" />
      ) : (
        <div className="3xl:left-8 4xl:left-10 5xl:left-12 absolute top-0 bottom-0 left-6 z-0 w-0.5 bg-zinc-200 sm:left-7" />
      )}

      {/* Icon Circle Sitting on the Line */}
      <div className="3xl:h-16 3xl:w-16 4xl:h-20 4xl:w-20 5xl:h-24 5xl:w-24 absolute top-0.5 left-0 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-xs transition-all duration-300 group-hover:border-zinc-400 group-hover:shadow-md sm:h-14 sm:w-14">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.logoPath}
          alt={item.subtitle}
          width={28}
          height={28}
          className="3xl:h-8 3xl:w-8 4xl:h-10 4xl:w-10 5xl:h-12 5xl:w-12 h-6 w-6 object-contain transition-all duration-300 group-hover:scale-110 sm:h-7 sm:w-7"
          style={{
            filter: "grayscale(1) brightness(0) opacity(0.75)",
          }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      {/* Content wrapper */}
      <div className="3xl:gap-2.5 3xl:pb-16 4xl:gap-3.5 4xl:pb-20 5xl:pb-24 flex flex-col gap-1.5 pb-12 group-last:pb-0">
        {/* Date & Badge Row */}
        <div className="3xl:text-base 4xl:text-lg 5xl:text-xl flex flex-wrap items-center gap-2 text-xs font-bold tracking-wider text-zinc-500 uppercase sm:text-sm">
          <div className="flex items-center gap-1.5">
            <Calendar className="3xl:h-5 3xl:w-5 4xl:h-6 4xl:w-6 5xl:h-7 5xl:w-7 h-3.5 w-3.5 text-zinc-400 sm:h-4 sm:w-4" />
            <span>{item.dateString}</span>
          </div>

          {item.badgeText && (
            <>
              <span className="hidden font-normal text-zinc-300 sm:inline">•</span>
              <span className="text-zinc-650 3xl:text-sm 3xl:px-3.5 3xl:py-1 4xl:text-base 4xl:px-4 4xl:py-1.5 5xl:text-lg 5xl:px-5 5xl:py-2 inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50/50 px-2.5 py-0.5 text-[0.7rem] font-bold tracking-wider uppercase sm:text-xs">
                {item.badgeText}
              </span>
            </>
          )}
        </div>

        {/* Title (Role or Degree) */}
        <h3 className="3xl:text-4xl 4xl:text-5xl 5xl:text-6xl text-lg leading-tight font-extrabold tracking-tight text-black sm:text-2xl lg:text-3xl">
          {item.title}
        </h3>

        {/* Subtitle (Organization) & Location Link */}
        <div>
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${item.subtitle} website`}
              className="group/link text-zinc-550 3xl:text-xl 4xl:text-2xl 5xl:text-3xl inline-flex flex-col gap-0.5 text-sm font-semibold transition-colors duration-300 hover:text-black sm:flex-row sm:items-center sm:gap-1.5 sm:text-base lg:text-lg"
            >
              <span className="inline-flex items-center gap-1.5">
                <span>{item.subtitle}</span>
                <ExternalLink className="3xl:h-5.5 3xl:w-5.5 4xl:h-6.5 4xl:w-6.5 5xl:h-7.5 5xl:w-7.5 h-3.5 w-3.5 text-zinc-400 transition-colors duration-300 group-hover/link:text-black sm:h-4 sm:w-4 lg:h-4.5 lg:w-4.5" />
              </span>
              {item.location && (
                <span className="flex items-center font-normal text-zinc-400">
                  <span className="mr-1.5 hidden text-zinc-300 sm:inline">|</span>
                  <span>{item.location}</span>
                </span>
              )}
            </a>
          ) : (
            <div className="text-zinc-550 3xl:text-xl 4xl:text-2xl 5xl:text-3xl flex flex-col gap-0.5 text-sm font-semibold sm:flex-row sm:items-center sm:gap-1.5 sm:text-base lg:text-lg">
              <span>{item.subtitle}</span>
              {item.location && (
                <span className="flex items-center font-normal text-zinc-400">
                  <span className="mr-1.5 hidden text-zinc-300 sm:inline">|</span>
                  <span>{item.location}</span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bullet Points (if any) */}
        {item.points && item.points.length > 0 && (
          <ul className="text-zinc-650 3xl:text-lg 3xl:space-y-3 3xl:mt-4 4xl:text-xl 4xl:space-y-4 4xl:mt-5 5xl:text-2xl 5xl:space-y-5 5xl:mt-6 mt-3 space-y-2 text-sm leading-relaxed sm:text-base">
            {item.points.map((point, idx) => (
              <li
                key={idx}
                className="3xl:pl-7 3xl:before:h-2 3xl:before:w-2 relative pl-5 before:absolute before:top-[0.6em] before:left-0 before:h-1.5 before:w-1.5 before:rounded-full before:bg-zinc-400"
              >
                {point}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function Timeline({ items = [], title, subtitle, id }: TimelineProps) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  if (!items.length) return null;

  return (
    <section
      id={id}
      aria-label={title}
      className="font-outfit 3xl:scroll-mt-36 3xl:py-24 w-full scroll-mt-24 py-12 transition-all duration-500 ease-in-out sm:scroll-mt-28 sm:py-16"
    >
      <div className="flex flex-col gap-10">
        {/* Unified/Scaled Section Title */}
        <div className="flex flex-col gap-2 text-center md:text-left">
          {subtitle && (
            <span className="3xl:text-sm 4xl:text-base 5xl:text-lg text-xs font-bold tracking-widest text-zinc-500 uppercase">
              {subtitle}
            </span>
          )}
          <h2 className="3xl:text-5xl 4xl:text-6xl 5xl:text-7xl text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
            {title}
          </h2>
        </div>

        {/* Timeline Track Container */}
        <div ref={ref} className="relative ml-2 md:ml-6">
          {/* Timeline Items */}
          <div className="space-y-0">
            {items.map((item, idx) => (
              <TimelineItemRow
                key={item.subtitle + item.title}
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
