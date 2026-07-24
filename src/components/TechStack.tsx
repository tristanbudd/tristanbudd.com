"use client";

/**
 * @file TechStack.tsx
 * @description Two side-by-side panels of square icon tiles (icon + name). Icons bundled via react-icons/si, rendered monochrome.
 */

import React from "react";
import {
  SiPhp,
  SiTypescript,
  SiJavascript,
  SiPython,
  SiSqlite,
  SiHtml5,
  SiCss,
  SiDart,
  SiRust,
  SiR,
  SiLaravel,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiTailwindcss,
  SiDocker,
  SiGit,
  SiPostgresql,
  SiMysql,
  SiLinux,
  SiFigma,
} from "react-icons/si";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const techIconMap: Record<
  string,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  php: SiPhp,
  typescript: SiTypescript,
  javascript: SiJavascript,
  python: SiPython,
  sqlite: SiSqlite,
  html5: SiHtml5,
  css: SiCss,
  dart: SiDart,
  rust: SiRust,
  r: SiR,
  laravel: SiLaravel,
  react: SiReact,
  nextdotjs: SiNextdotjs,
  nodedotjs: SiNodedotjs,
  tailwindcss: SiTailwindcss,
  docker: SiDocker,
  git: SiGit,
  postgresql: SiPostgresql,
  mysql: SiMysql,
  linux: SiLinux,
  figma: SiFigma,
};

export interface TechItem {
  name: string;
  /** Simple Icons slug (https://simpleicons.org/) */
  slug: string;
}

export interface TechStackProps {
  languages?: TechItem[];
  tools?: TechItem[];
  title?: string;
  subtitle?: string;
}

function IconTile({ item, visible, delay }: { item: TechItem; visible: boolean; delay: number }) {
  const Icon = techIconMap[item.slug.toLowerCase()];
  return (
    <div
      className="group/tile flex flex-col items-center gap-0 overflow-hidden rounded-xl border border-zinc-200/70 bg-white/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-zinc-400 hover:bg-white hover:shadow-md"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms, box-shadow 0.3s ease, border-color 0.3s ease, background-color 0.3s ease, translate 0.3s ease`,
      }}
    >
      {/* Top accent bar */}
      <div className="h-0.5 w-full origin-left scale-x-0 bg-linear-to-r from-zinc-700 via-black to-zinc-800 transition-transform duration-300 group-hover/tile:scale-x-100" />

      {/* Icon */}
      <div className="3xl:p-8 3xl:pb-4 4xl:p-10 4xl:pb-5 5xl:p-12 5xl:pb-6 flex flex-1 items-center justify-center p-6 pb-3">
        {Icon && (
          <Icon
            className="3xl:h-12 3xl:w-12 4xl:h-14 4xl:w-14 5xl:h-16 5xl:w-16 h-10 w-10 transition-all duration-300 group-hover/tile:scale-110"
            style={{ filter: "grayscale(1) brightness(0) opacity(0.75)" }}
            aria-label={item.name}
          />
        )}
      </div>

      {/* Name */}
      <div className="3xl:text-sm 4xl:text-base 5xl:text-lg w-full px-3 pb-4 text-center text-[0.68rem] font-semibold tracking-wide text-zinc-500 transition-colors duration-300 group-hover/tile:text-black">
        {item.name}
      </div>
    </div>
  );
}

function Panel({ label, heading, items }: { label: string; heading: string; items: TechItem[] }) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <div className="group 3xl:rounded-3xl 3xl:p-10 3xl:gap-8 4xl:p-12 4xl:gap-10 5xl:p-16 5xl:gap-12 relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-zinc-200/60 bg-white/40 p-8 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-zinc-300 hover:bg-white/60 hover:shadow-md">
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 h-0.75 w-full origin-left scale-x-0 bg-linear-to-r from-zinc-700 via-black to-zinc-800 transition-transform duration-300 group-hover:scale-x-100" />

      <div className="flex flex-col gap-1">
        <span className="3xl:text-sm 4xl:text-base 5xl:text-lg text-xs font-bold tracking-widest text-zinc-500 uppercase">
          {label}
        </span>
        <h3 className="3xl:text-3xl 4xl:text-4xl 5xl:text-5xl text-xl font-extrabold tracking-tight text-black sm:text-2xl">
          {heading}
        </h3>
      </div>

      <div
        ref={ref}
        className="3xl:gap-4 4xl:gap-6 5xl:gap-8 grid grid-cols-2 gap-3 min-[380px]:grid-cols-3 sm:grid-cols-4"
      >
        {items.map((item, idx) => (
          <IconTile key={item.slug} item={item} visible={visible} delay={idx * 60} />
        ))}
      </div>
    </div>
  );
}

export default function TechStack({
  languages = [],
  tools = [],
  title = "Tech Stack",
  subtitle = "Built with",
}: TechStackProps) {
  if (!languages.length && !tools.length) return null;

  return (
    <section
      id="tech-stack"
      aria-label="Tech Stack"
      className="font-outfit 3xl:scroll-mt-36 3xl:py-24 w-full scroll-mt-24 py-12 transition-all duration-500 ease-in-out sm:scroll-mt-28 sm:py-16"
    >
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <span className="3xl:text-sm 4xl:text-base 5xl:text-lg text-xs font-bold tracking-widest text-zinc-500 uppercase">
            {subtitle}
          </span>
          <h2 className="3xl:text-5xl 4xl:text-6xl 5xl:text-7xl text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {languages.length > 0 && (
            <Panel label="Coding Languages" heading="Languages" items={languages} />
          )}
          {tools.length > 0 && (
            <Panel label="Software & Tooling" heading="Software" items={tools} />
          )}
        </div>
      </div>
    </section>
  );
}
