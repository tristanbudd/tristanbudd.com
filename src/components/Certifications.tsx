"use client";

/**
 * @file Certifications.tsx
 * @description Glassmorphic certifications showcase component. All data received as props.
 */

import { Calendar, ExternalLink } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export interface Certificate {
  title: string;
  issuer: string;
  date: string;
  skills: string[];
  logoSlug: string;
  credentialUrl?: string;
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
  const logoUrl = `https://cdn.simpleicons.org/${cert.logoSlug}`;

  return (
    <div
      className="group 3xl:p-10 4xl:p-12 5xl:p-16 relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-zinc-200/60 bg-white/40 p-8 shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:bg-white/80 hover:shadow-md"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, box-shadow 0.3s ease, border-color 0.3s ease, background-color 0.3s ease, transform 0.3s ease`,
      }}
    >
      {/* Sliding Accent Border */}
      <div className="absolute top-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-linear-to-r from-zinc-700 via-black to-zinc-800 transition-transform duration-300 group-hover:scale-x-100" />

      {/* Header: Icon & Organization */}
      <div className="flex items-center justify-between">
        <div className="3xl:h-16 3xl:w-16 3xl:rounded-2xl 4xl:h-20 4xl:w-20 5xl:h-24 5xl:w-24 flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-white/70 text-zinc-700 transition-all duration-300 group-hover:border-zinc-300 group-hover:bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl}
            alt={cert.issuer}
            width={24}
            height={24}
            loading="lazy"
            className="3xl:h-8 3xl:w-8 4xl:h-10 4xl:w-10 5xl:h-12 5xl:w-12 h-6 w-6 transition-all duration-300 group-hover:scale-110"
            style={{
              filter: "grayscale(1) brightness(0) opacity(0.75)",
            }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
        {cert.credentialUrl ? (
          <a
            href={cert.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Verify ${cert.title} credential by ${cert.issuer}`}
            className="group/link 3xl:text-sm 4xl:text-base 5xl:text-lg inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-zinc-500 uppercase transition-colors duration-300 hover:text-black"
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
    </div>
  );
}

export default function Certifications({
  certificates = [],
  title = "Certifications & Learning",
  subtitle = "Qualifications",
}: CertificationsProps) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  if (!certificates.length) return null;

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

        {/* Certificates Grid */}
        <div ref={ref} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert, idx) => (
            <CertificateCard key={cert.title} cert={cert} visible={visible} delay={idx * 150} />
          ))}
        </div>
      </div>
    </section>
  );
}
