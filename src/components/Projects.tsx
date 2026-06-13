"use client";

/**
 * @file Projects.tsx
 * @description Showcases projects that I have worked on. Paginated with scroll reveal.
 */

import { Project } from "@/data/projects";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Search,
  X,
  ChevronDown,
  Check,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import CTAButton from "./CTAButton";

function ProjectImagePlaceholder() {
  return (
    <div className="3xl:p-6 4xl:p-8 5xl:p-10 relative w-full bg-zinc-50/30 p-4">
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
          className="font-outfit 3xl:text-sm 4xl:text-base 5xl:text-lg fill-zinc-400 text-xs font-semibold tracking-wider transition-colors duration-300 group-hover/card:fill-zinc-500"
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
  headingLevel = "h3",
}: {
  project: Project;
  visible: boolean;
  delay: number;
  headingLevel?: "h2" | "h3";
}) {
  const HeadingTag = headingLevel;
  const [animate, setAnimate] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 30);
    return () => clearTimeout(timer);
  }, []);

  const isCardVisible = visible && animate;

  return (
    <div
      className="group/card 3xl:rounded-3xl relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200/60 bg-white/40 shadow-xs backdrop-blur-md transition-all duration-500 hover:border-zinc-300 hover:bg-white/60 hover:shadow-md"
      style={{
        opacity: isCardVisible ? 1 : 0,
        transform: isCardVisible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, box-shadow 0.3s ease, border-color 0.3s ease, background-color 0.3s ease`,
      }}
    >
      {/* Outline Placeholder Top Portion */}
      <ProjectImagePlaceholder />

      {/* Content Bottom Portion */}
      <div className="3xl:px-6 3xl:pb-8 3xl:pt-4 4xl:px-8 4xl:pb-10 4xl:pt-5 5xl:px-10 5xl:pb-12 5xl:pt-6 flex flex-1 flex-col px-4 pt-2 pb-6 sm:pt-3">
        <HeadingTag className="3xl:text-2xl 4xl:text-3xl 5xl:text-4xl text-lg font-bold text-black transition-colors duration-300 group-hover/card:text-zinc-800 sm:text-xl">
          {project.title}
        </HeadingTag>
        <p className="text-zinc-650 3xl:mt-3 3xl:text-base 4xl:mt-4 4xl:text-lg 5xl:text-xl mt-2 flex-1 text-sm leading-relaxed">
          {project.description}
        </p>

        {/* Tags */}
        <div className="3xl:mt-6 3xl:gap-2.5 4xl:gap-3 mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-zinc-650 3xl:px-3.5 3xl:py-1 3xl:text-sm 4xl:px-4 4xl:py-1.5 4xl:text-base 5xl:px-5 5xl:py-2 5xl:text-lg rounded-full border border-zinc-200/50 bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Link & Icons */}
        <div className="3xl:mt-8 3xl:pt-6 4xl:mt-10 4xl:pt-8 mt-6 flex items-center justify-between border-t border-zinc-100 pt-4">
          <Link
            href={`/projects/${project.slug}`}
            aria-label={`Learn more about project ${project.title}`}
            className="group/link 3xl:text-base 4xl:text-lg 5xl:text-xl inline-flex items-center gap-1 text-sm font-bold text-black transition-colors after:absolute after:inset-0 after:z-10 hover:text-zinc-700"
          >
            <span>Learn More</span>
            <span className="sr-only"> about {project.title}</span>
            <ArrowRight className="3xl:h-4.5 3xl:w-4.5 4xl:h-5 4xl:w-5 5xl:h-6 5xl:w-6 h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>

          <div className="3xl:gap-4.5 4xl:gap-6 relative z-20 flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 transition-colors duration-300 hover:text-black"
                aria-label={`${project.title} GitHub Repository`}
              >
                <Github className="3xl:h-5.5 3xl:w-5.5 4xl:h-6.5 4xl:w-6.5 5xl:h-7.5 5xl:w-7.5 h-4.5 w-4.5" />
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
                <ExternalLink className="3xl:h-5.5 3xl:w-5.5 4xl:h-6.5 4xl:w-6.5 5xl:h-7.5 5xl:w-7.5 h-4.5 w-4.5" />
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
  showHeader?: boolean;
}

const getRelevanceScore = (title: string, desc: string, content?: string, query?: string) => {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = title.toLowerCase();
  const d = desc.toLowerCase();
  const c = content ? content.toLowerCase() : "";

  let score = 0;
  if (t === q) {
    score += 1000;
  } else if (t.startsWith(q)) {
    score += 500;
  } else if (t.includes(q)) {
    score += 200;
  }

  if (d.includes(q)) {
    score += 50;
  }

  if (c.includes(q)) {
    score += 10;
  }
  return score;
};

export default function Projects({
  projects = [],
  title = "Featured Projects",
  subtitle = "My Work",
  isPreview = false,
  showHeader = true,
}: ProjectsProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState("newest");
  const [sortDropdownOpen, setSortDropdownOpen] = React.useState(false);

  const { ref, visible: revealVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.05 });
  const visible = revealVisible;

  // Filter projects based on search query
  const filteredProjects = React.useMemo(() => {
    if (!searchQuery) return projects;

    const query = searchQuery.toLowerCase();

    return projects.filter((project) => {
      const titleMatch = project.title.toLowerCase().includes(query);
      const descMatch = project.description.toLowerCase().includes(query);
      const tagMatch = project.tags && project.tags.some((t) => t.toLowerCase().includes(query));
      const contentMatch =
        project.extendedDescription && project.extendedDescription.toLowerCase().includes(query);
      return titleMatch || descMatch || tagMatch || contentMatch;
    });
  }, [projects, searchQuery]);

  // Sort projects based on chosen criteria
  const sortedProjects = React.useMemo(() => {
    const list = [...filteredProjects];
    if (sortBy === "relevance" && searchQuery) {
      list.sort((a, b) => {
        const scoreA = getRelevanceScore(
          a.title,
          a.description,
          a.extendedDescription,
          searchQuery
        );
        const scoreB = getRelevanceScore(
          b.title,
          b.description,
          b.extendedDescription,
          searchQuery
        );
        return scoreB - scoreA;
      });
    } else if (sortBy === "newest") {
      list.sort((a, b) => {
        const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return bDate - aDate;
      });
    } else if (sortBy === "oldest") {
      list.sort((a, b) => {
        const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return aDate - bDate;
      });
    } else if (sortBy === "alphabetical-asc") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "alphabetical-desc") {
      list.sort((a, b) => b.title.localeCompare(a.title));
    }
    return list;
  }, [filteredProjects, sortBy, searchQuery]);

  if (!projects.length) return null;

  const itemsPerPage = 6;
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);

  // Render top 3 in preview, otherwise paginate
  const displayedProjects = isPreview
    ? sortedProjects.slice(0, 3)
    : sortedProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <section
      id="projects"
      aria-label="Projects Showcase"
      className={`font-outfit w-full transition-all duration-500 ease-in-out ${
        showHeader
          ? "3xl:scroll-mt-36 3xl:py-24 scroll-mt-24 py-12 sm:scroll-mt-28 sm:py-16"
          : "3xl:pt-14 3xl:pb-24 pt-8 pb-12 sm:pt-10 sm:pb-16"
      }`}
    >
      <div ref={ref} className="flex flex-col gap-10">
        {/* Section Header */}
        {showHeader && (
          <div className="flex flex-col gap-2 text-center md:text-left">
            <span className="3xl:text-sm 4xl:text-base 5xl:text-lg text-xs font-bold tracking-widest text-zinc-500 uppercase">
              {subtitle}
            </span>
            <h2 className="3xl:text-5xl 4xl:text-6xl 5xl:text-7xl text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
              {title}
            </h2>
          </div>
        )}

        {/* Search and Sorting controls (Full page showcase only) */}
        {!isPreview && (
          <div className="flex flex-col gap-4 border-b border-zinc-200/50 pb-8 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Search className="h-4 w-4 text-zinc-400" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  const newVal = e.target.value;
                  setSearchQuery(newVal);
                  setCurrentPage(1);
                  if (newVal && sortBy !== "relevance") {
                    setSortBy("relevance");
                  } else if (!newVal && sortBy === "relevance") {
                    setSortBy("newest");
                  }
                }}
                placeholder="Search projects..."
                className="w-full rounded-full border border-zinc-200/60 bg-white/40 py-2.5 pr-10 pl-10 text-sm font-medium shadow-2xs transition-all duration-300 placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white/80 focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                    if (sortBy === "relevance") {
                      setSortBy("newest");
                    }
                  }}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-400 transition-colors hover:text-black"
                  aria-label="Clear Search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative self-end sm:self-auto">
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-zinc-200/60 bg-white/40 px-5 py-2.5 text-sm font-semibold text-zinc-700 shadow-2xs transition-all duration-300 select-none hover:border-zinc-300 hover:bg-white/85"
              >
                <span>
                  Sort by:{" "}
                  {sortBy === "relevance"
                    ? "Relevance"
                    : sortBy === "newest"
                      ? "Newest First"
                      : sortBy === "oldest"
                        ? "Oldest First"
                        : sortBy === "alphabetical-asc"
                          ? "A-Z"
                          : "Z-A"}
                </span>
                <ChevronDown
                  className={`text-zinc-550 h-4 w-4 transition-transform duration-300 ${sortDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {sortDropdownOpen && (
                <>
                  {/* Backdrop overlay to close when clicking outside */}
                  <div className="fixed inset-0 z-20" onClick={() => setSortDropdownOpen(false)} />
                  <div className="animate-in fade-in slide-in-from-top-2 absolute right-0 z-30 mt-2 w-48 rounded-2xl border border-zinc-200/80 bg-white/95 py-1.5 shadow-lg backdrop-blur-md duration-200">
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSortBy("relevance");
                          setCurrentPage(1);
                          setSortDropdownOpen(false);
                        }}
                        className="text-zinc-750 flex w-full items-center justify-between rounded-t-xl px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-black/5"
                      >
                        <span>Relevance</span>
                        {sortBy === "relevance" && <Check className="h-4 w-4 text-black" />}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSortBy("newest");
                        setCurrentPage(1);
                        setSortDropdownOpen(false);
                      }}
                      className={`text-zinc-750 flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-black/5 ${!searchQuery ? "rounded-t-xl" : ""}`}
                    >
                      <span>Newest First</span>
                      {sortBy === "newest" && <Check className="h-4 w-4 text-black" />}
                    </button>
                    <button
                      onClick={() => {
                        setSortBy("oldest");
                        setCurrentPage(1);
                        setSortDropdownOpen(false);
                      }}
                      className="text-zinc-750 flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-black/5"
                    >
                      <span>Oldest First</span>
                      {sortBy === "oldest" && <Check className="h-4 w-4 text-black" />}
                    </button>
                    <button
                      onClick={() => {
                        setSortBy("alphabetical-asc");
                        setCurrentPage(1);
                        setSortDropdownOpen(false);
                      }}
                      className="text-zinc-750 flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-black/5"
                    >
                      <span>A-Z</span>
                      {sortBy === "alphabetical-asc" && <Check className="h-4 w-4 text-black" />}
                    </button>
                    <button
                      onClick={() => {
                        setSortBy("alphabetical-desc");
                        setCurrentPage(1);
                        setSortDropdownOpen(false);
                      }}
                      className="text-zinc-750 flex w-full items-center justify-between rounded-b-xl px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-black/5"
                    >
                      <span>Z-A</span>
                      {sortBy === "alphabetical-desc" && <Check className="h-4 w-4 text-black" />}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Project Cards Grid / Empty State */}
        {sortedProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-white/20 p-12 text-center backdrop-blur-md">
            <span className="mb-4 text-black">
              <Search className="h-12 w-12 stroke-[1.5]" />
            </span>
            <h3 className="mb-1 text-lg font-bold text-black">No Projects Found</h3>
            <p className="mb-6 max-w-xs text-sm text-zinc-500">
              We couldn&apos;t find any projects matching your search criteria. Try modifying your
              search or filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSortBy("newest");
                setCurrentPage(1);
              }}
              className="rounded-full border border-black bg-black px-6 py-2.5 text-xs font-bold tracking-wider text-white uppercase transition-all duration-300 hover:bg-zinc-900"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayedProjects.map((project, idx) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  visible={visible}
                  delay={idx * 100}
                  headingLevel={showHeader ? "h3" : "h2"}
                />
              ))}
            </div>

            {/* Pagination Controls (Full page showcase only) */}
            {!isPreview && totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white/40 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-zinc-300 hover:bg-white/80 disabled:opacity-40 disabled:hover:border-zinc-200 disabled:hover:bg-white/40"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="h-4 w-4 text-black" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition-all duration-300 ${
                      currentPage === page
                        ? "border-black bg-black text-white"
                        : "text-zinc-550 border-zinc-200 bg-white/40 hover:border-zinc-300 hover:bg-white/80"
                    }`}
                    aria-label={`Page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white/40 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-zinc-300 hover:bg-white/80 disabled:opacity-40 disabled:hover:border-zinc-200 disabled:hover:bg-white/40"
                  aria-label="Next Page"
                >
                  <ChevronRight className="h-4 w-4 text-black" />
                </button>
              </div>
            )}
          </>
        )}

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
