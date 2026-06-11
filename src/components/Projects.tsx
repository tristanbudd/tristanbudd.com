"use client";

/**
 * @file Projects.tsx
 * @description Showcases Tristan's projects in a grid with premium, interactive CSS mockups.
 */

import { ArrowRight, ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Project } from "@/data/portfolio";
import CTAButton from "./CTAButton";

function ProjectImagePlaceholder() {
  return (
    <div className="relative w-full bg-zinc-50/30 p-4">
      <svg viewBox="0 0 600 360" className="h-auto w-full fill-none">
        <rect
          x="1.5"
          y="1.5"
          width="597"
          height="357"
          rx="8"
          className="fill-zinc-50/5 stroke-zinc-300 transition-colors duration-300 group-hover/card:stroke-zinc-400"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
        <text
          x="300"
          y="180"
          textAnchor="middle"
          dominantBaseline="middle"
          className="font-outfit fill-zinc-400 text-xs font-semibold tracking-wider transition-colors duration-300 group-hover/card:fill-zinc-500"
        >
          600 × 360 (5:3 Ratio)
        </text>
      </svg>
    </div>
  );
}

function ProjectCard({
  project,
  visible,
  delay,
}: {
  project: Project;
  visible: boolean;
  delay: number;
}) {
  return (
    <div
      className="group/card relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200/60 bg-white/40 shadow-xs backdrop-blur-md transition-all duration-500 hover:border-zinc-300 hover:bg-white/60 hover:shadow-md"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, box-shadow 0.3s ease, border-color 0.3s ease, background-color 0.3s ease`,
      }}
    >
      {/* Outline Placeholder Top Portion */}
      <ProjectImagePlaceholder />

      {/* Content Bottom Portion */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold text-black transition-colors duration-300 group-hover/card:text-zinc-800 sm:text-xl">
          {project.title}
        </h3>
        <p className="text-zinc-650 mt-2 flex-1 text-sm leading-relaxed">{project.description}</p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-zinc-650 rounded-full border border-zinc-200/50 bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Link & Icons */}
        <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4">
          <Link
            href={`/projects/${project.slug}`}
            className="group/link inline-flex items-center gap-1 text-sm font-bold text-black transition-colors after:absolute after:inset-0 after:z-10 hover:text-zinc-700"
          >
            <span>Learn More</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>

          <div className="relative z-20 flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 transition-colors duration-300 hover:text-black"
                aria-label={`${project.title} GitHub Repository`}
              >
                <Github className="h-4.5 w-4.5" />
              </a>
            )}
            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 transition-colors duration-300 hover:text-black"
                aria-label={`${project.title} Project Website`}
              >
                <ExternalLink className="h-4.5 w-4.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export interface ProjectsProps {
  projects: Project[];
  title?: string;
  subtitle?: string;
  isPreview?: boolean;
}

export default function Projects({
  projects = [],
  title = "Featured Projects",
  subtitle = "My Work",
  isPreview = false,
}: ProjectsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(!isPreview);

  useEffect(() => {
    if (!isPreview) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isPreview]);

  if (!projects.length) return null;

  // Render top 3 in preview, otherwise render all
  const displayedProjects = isPreview ? projects.slice(0, 3) : projects;

  return (
    <section
      aria-label="Projects Showcase"
      className="font-outfit 3xl:scroll-mt-36 3xl:py-24 w-full scroll-mt-24 py-12 transition-all duration-500 ease-in-out sm:scroll-mt-28 sm:py-16"
    >
      <div className="flex flex-col gap-10">
        {/* Section Header */}
        <div className="flex flex-col gap-2 text-center md:text-left">
          <span className="3xl:text-sm text-xs font-bold tracking-widest text-zinc-500 uppercase">
            {subtitle}
          </span>
          <h2 className="3xl:text-5xl text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
            {title}
          </h2>
        </div>

        {/* Project Cards Grid */}
        <div ref={ref} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedProjects.map((project, idx) => (
            <ProjectCard key={project.slug} project={project} visible={visible} delay={idx * 100} />
          ))}
        </div>

        {/* View All Projects Button (Home page preview only) */}
        {isPreview && (
          <div className="mt-4 flex justify-center md:justify-start">
            <CTAButton text="View All Projects" href="/projects" />
          </div>
        )}
      </div>
    </section>
  );
}
