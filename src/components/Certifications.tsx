"use client";

/**
 * @file Certifications.tsx
 * @description Glassmorphic certifications showcase component. All data received as props.
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { SiAnthropic, SiDatacamp, SiGithub, SiGoogle } from "react-icons/si";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const AUTOPLAY_INTERVAL_MS = 5000;

const certIconMap: Record<
  string,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  anthropic: SiAnthropic,
  datacamp: SiDatacamp,
  github: SiGithub,
  google: SiGoogle,
};

export interface Certificate {
  title: string;
  issuer: string;
  date: string;
  skills: string[];
  logoSlug: string;
  credentialUrl?: string;
  credentials?: { label: string; url: string }[];
}

interface CertificationsProps {
  certificates: Certificate[];
  title?: string;
  subtitle?: string;
}

function CertificateCard({
  cert,
  visible,
  delay,
}: {
  cert: Certificate;
  visible: boolean;
  delay: number;
}) {
  return (
    <div
      className="group 3xl:p-10 4xl:p-12 5xl:p-16 relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-zinc-200/60 bg-white/40 p-8 shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:bg-white/80 hover:shadow-md"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, box-shadow 0.3s ease, border-color 0.3s ease, background-color 0.3s ease, transform 0.3s ease`,
      }}
    >
      {/* Sliding Accent Border */}
      <div className="absolute top-0 left-0 h-0.75 w-full origin-left scale-x-0 bg-linear-to-r from-zinc-700 via-black to-zinc-800 transition-transform duration-300 group-hover:scale-x-100" />

      {/* Header: Icon & Organization */}
      <div className="flex items-center justify-between">
        <div className="3xl:h-16 3xl:w-16 3xl:rounded-2xl 4xl:h-20 4xl:w-20 5xl:h-24 5xl:w-24 flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-white/70 text-zinc-700 transition-all duration-300 group-hover:border-zinc-300 group-hover:bg-white">
          {(() => {
            const Icon = certIconMap[cert.logoSlug?.toLowerCase() ?? ""];
            return Icon ? (
              <Icon
                className="3xl:h-8 3xl:w-8 4xl:h-10 4xl:w-10 5xl:h-12 5xl:w-12 h-6 w-6 transition-all duration-300 group-hover:scale-110"
                style={{ filter: "grayscale(1) brightness(0) opacity(0.75)" }}
                aria-label={cert.issuer}
              />
            ) : null;
          })()}
        </div>
        {cert.credentialUrl ? (
          <a
            href={cert.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Verify ${cert.title} credential by ${cert.issuer}`}
            className="group/link 3xl:text-sm 4xl:text-base 5xl:text-lg inline-flex items-center gap-1.5 rounded-sm text-xs font-bold tracking-widest text-zinc-500 uppercase transition-colors duration-300 hover:text-black focus:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            <span>{cert.issuer}</span>
            <ExternalLink className="3xl:h-4.5 3xl:w-4.5 4xl:h-5 4xl:w-5 5xl:h-6 5xl:w-6 h-3.5 w-3.5 text-zinc-400 transition-colors duration-300 group-hover/link:text-black" />
          </a>
        ) : (
          <span className="3xl:text-sm 4xl:text-base 5xl:text-lg text-xs font-bold tracking-widest text-zinc-500 uppercase">
            {cert.issuer}
          </span>
        )}
      </div>

      {/* Certificate Title */}
      <h3 className="3xl:text-2xl 4xl:text-3xl 5xl:text-4xl text-lg leading-tight font-extrabold tracking-tight text-black sm:text-xl">
        {cert.title}
      </h3>

      {/* Achieved Date */}
      <div className="3xl:text-sm 4xl:text-base 5xl:text-lg flex items-center gap-1.5 text-xs font-semibold tracking-wider text-zinc-500 uppercase">
        <Calendar className="3xl:h-4.5 3xl:w-4.5 4xl:h-5 4xl:w-5 5xl:h-6 5xl:w-6 h-3.5 w-3.5 text-zinc-400" />
        <span>Achieved: {cert.date}</span>
      </div>

      {/* Skills / Key Areas: Sits directly below Achieved, no forced bottom alignment */}
      <div className="3xl:mt-2 4xl:mt-3 5xl:mt-4 mt-2 flex flex-col gap-3">
        <span className="3xl:text-xs 4xl:text-sm 5xl:text-base text-[0.68rem] font-bold tracking-widest text-zinc-400 uppercase">
          Key Skills
        </span>
        <div className="3xl:gap-2.5 4xl:gap-3 flex flex-wrap gap-1.5">
          {cert.skills.map((skill) => (
            <span
              key={skill}
              className="text-zinc-650 3xl:px-3.5 3xl:py-1 3xl:text-xs 4xl:px-4 4xl:py-1.5 4xl:text-sm 5xl:px-5 5xl:py-2 5xl:text-base inline-flex items-center rounded-md border border-zinc-200/50 bg-white/50 px-2.5 py-0.5 text-[0.7rem] font-semibold transition-all duration-350 hover:border-black hover:bg-black hover:text-white"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Verification Links: For combined certificates with multiple credentials */}
      {cert.credentials?.length ? (
        <div className="3xl:mt-2 4xl:mt-3 5xl:mt-4 mt-2 flex flex-col gap-3">
          <span className="3xl:text-xs 4xl:text-sm 5xl:text-base text-[0.68rem] font-bold tracking-widest text-zinc-400 uppercase">
            Credentials
          </span>
          <div className="3xl:gap-x-6 flex flex-wrap gap-x-4 gap-y-2">
            {cert.credentials.map((credential) => (
              <a
                key={credential.url}
                href={credential.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Verify ${credential.label} credential by ${cert.issuer}`}
                className="group/link 3xl:text-sm 4xl:text-base 5xl:text-lg inline-flex items-center gap-1.5 rounded-sm text-xs font-bold tracking-widest text-zinc-500 uppercase transition-colors duration-300 hover:text-black focus:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                <span>{credential.label}</span>
                <ExternalLink className="3xl:h-4.5 3xl:w-4.5 4xl:h-5 4xl:w-5 5xl:h-6 5xl:w-6 h-3.5 w-3.5 text-zinc-400 transition-colors duration-300 group-hover/link:text-black" />
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CarouselButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous certifications" : "Next certifications"}
      className="3xl:h-14 3xl:w-14 4xl:h-16 4xl:w-16 5xl:h-20 5xl:w-20 flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200/60 bg-white/40 text-zinc-600 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-zinc-300 hover:bg-white/80 hover:text-black hover:shadow-md focus:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-zinc-200/60 disabled:hover:bg-white/40 disabled:hover:text-zinc-600 disabled:hover:shadow-xs"
    >
      <Icon className="3xl:h-6 3xl:w-6 4xl:h-7 4xl:w-7 5xl:h-9 5xl:w-9 h-5 w-5" />
    </button>
  );
}

export default function Certifications({
  certificates = [],
  title = "Certifications & Learning",
  subtitle = "Qualifications",
}: CertificationsProps) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [activePage, setActivePage] = useState(0);

  // Distance between snap points: one card plus the track gap.
  const getStep = () => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return 0;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return card.offsetWidth + gap;
  };

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanScrollPrev(track.scrollLeft > 1);
    setCanScrollNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 1);

    const step = getStep();
    if (!step) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const visibleCount = Math.max(1, Math.round((track.clientWidth + gap) / step));
    const pages = Math.max(1, track.children.length - visibleCount + 1);
    setPageCount(pages);
    setActivePage(Math.min(pages - 1, Math.round(track.scrollLeft / step)));
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateScrollState();
    track.addEventListener("scroll", updateScrollState, { passive: true });
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(track);

    return () => {
      track.removeEventListener("scroll", updateScrollState);
      observer.disconnect();
    };
  }, [updateScrollState, certificates.length]);

  // Autoplay: advance one card every few seconds, looping back to the start.
  // Pauses on hover and stops permanently once the user interacts with the carousel.
  const [autoplayStopped, setAutoplayStopped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!visible || autoplayStopped || isHovered || pageCount <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = window.setInterval(() => {
      const track = trackRef.current;
      const card = track?.firstElementChild as HTMLElement | null;
      if (!track || !card) return;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      if (atEnd) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        track.scrollBy({ left: card.offsetWidth + gap, behavior: "smooth" });
      }
    }, AUTOPLAY_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [visible, autoplayStopped, isHovered, pageCount]);

  const stopAutoplay = () => setAutoplayStopped(true);

  // Only horizontal wheel/trackpad gestures count; vertical page scrolling shouldn't stop autoplay.
  const handleWheel = (event: React.WheelEvent) => {
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) stopAutoplay();
  };

  // Shift the track by exactly one card per click.
  const scrollByCard = (direction: 1 | -1) => {
    trackRef.current?.scrollBy({ left: direction * getStep(), behavior: "smooth" });
  };

  const scrollToPage = (page: number) => {
    trackRef.current?.scrollTo({ left: page * getStep(), behavior: "smooth" });
  };

  if (!certificates.length) return null;

  const showControls = canScrollPrev || canScrollNext;

  return (
    <section
      id="certifications"
      aria-label="Certifications & Learning"
      className="font-outfit 3xl:scroll-mt-36 3xl:py-24 w-full scroll-mt-24 py-12 transition-all duration-500 ease-in-out sm:scroll-mt-28 sm:py-16"
    >
      <div className="flex flex-col gap-10">
        {/* Section Title */}
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

        <div
          className="flex flex-col gap-10"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onPointerDown={stopAutoplay}
          onKeyDown={stopAutoplay}
          onFocus={stopAutoplay}
          onWheel={handleWheel}
        >
          {/* Certificates Carousel: 1 / 2 / 3 cards visible per breakpoint */}
          <div ref={ref}>
            <div
              ref={trackRef}
              className="no-scrollbar -mx-2 -my-4 flex snap-x snap-mandatory scroll-px-2 gap-6 overflow-x-auto px-2 py-4"
            >
              {certificates.map((cert, idx) => (
                <div
                  key={cert.title}
                  className="w-full shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
                >
                  <CertificateCard cert={cert} visible={visible} delay={Math.min(idx, 3) * 150} />
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Controls: Prev / page indicators / Next */}
          {showControls && (
            <div className="3xl:gap-6 flex items-center justify-center gap-4 md:justify-between">
              <CarouselButton
                direction="prev"
                disabled={!canScrollPrev}
                onClick={() => scrollByCard(-1)}
              />
              <div className="3xl:gap-3 flex items-center gap-2">
                {Array.from({ length: pageCount }, (_, page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => scrollToPage(page)}
                    aria-label={`Show certifications from ${page + 1}`}
                    aria-current={page === activePage}
                    className={`3xl:h-2.5 4xl:h-3 5xl:h-4 h-2 rounded-full transition-all duration-300 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
                      page === activePage
                        ? "3xl:w-12 4xl:w-14 5xl:w-18 w-8 bg-black"
                        : "3xl:w-2.5 4xl:w-3 5xl:w-4 w-2 bg-zinc-300 hover:bg-zinc-500"
                    }`}
                  />
                ))}
              </div>
              <CarouselButton
                direction="next"
                disabled={!canScrollNext}
                onClick={() => scrollByCard(1)}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
