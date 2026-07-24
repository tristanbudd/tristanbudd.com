/**
 * @file BlogSection.tsx
 * @description Renders a list/preview of blog posts with a horizontal split-row editorial layout.
 */

"use client";

import { BlogPost } from "@/data/blog";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { parseDate } from "@/lib/utils";
import { ArrowRight, Check, ChevronDown, Clock, Search, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useTransition } from "../context/TransitionContext";
import CTAButton from "./CTAButton";
import DbOfflineMessage from "./DbOfflineMessage";
import { sendGTMEvent } from "@/lib/gtm";

function BlogRow({
  post,
  visible,
  delay,
  headingLevel = "h3",
}: {
  post: BlogPost;
  visible: boolean;
  delay: number;
  headingLevel?: "h2" | "h3";
}) {
  const { month, day, year } = parseDate(post.publishedAt);
  const HeadingTag = headingLevel;
  const [animate, setAnimate] = useState(false);
  const { triggerTransition } = useTransition();

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    sendGTMEvent("blog_click", {
      blog_title: post.title,
      blog_slug: post.slug,
      blog_category: post.category,
    });
    const triggered = triggerTransition(href);
    if (triggered) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 30);
    return () => clearTimeout(timer);
  }, []);

  const isCardVisible = visible && animate;

  return (
    <div className="group/blog relative w-full pt-1 pb-1">
      <div
        className="3xl:p-10 4xl:p-12 5xl:p-16 3xl:gap-10 relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-zinc-200/60 bg-white/40 p-8 shadow-xs backdrop-blur-md transition-all duration-500 group-hover/blog:-translate-y-1 group-hover/blog:border-zinc-300 group-hover/blog:bg-white/80 group-hover/blog:shadow-md focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-2 md:flex-row md:items-start md:gap-8"
        style={{
          opacity: isCardVisible ? 1 : 0,
          transform: isCardVisible ? "translateY(0)" : "translateY(24px)",
          transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, box-shadow 0.3s ease, border-color 0.3s ease, background-color 0.3s ease, transform 0.3s ease`,
        }}
      >
        {/* Top slide-in border line */}
        <div className="absolute top-0 left-0 h-0.75 w-full origin-left scale-x-0 bg-linear-to-r from-zinc-700 via-black to-zinc-800 transition-transform duration-300 group-hover/blog:scale-x-100" />

        {/* Date stamp sidebar */}
        <div className="border-zinc-150 3xl:w-48 4xl:w-56 5xl:w-64 3xl:pr-10 4xl:pr-12 5xl:pr-16 flex flex-row items-center justify-between border-b pb-4 md:w-36 md:shrink-0 md:flex-col md:items-start md:gap-1 md:border-r md:border-b-0 md:border-zinc-200/60 md:pr-6 md:pb-0">
          <div className="flex flex-col items-start leading-none">
            <span className="font-outfit 3xl:text-7xl 4xl:text-8xl 5xl:text-9xl text-5xl leading-none font-extrabold tracking-tight text-black sm:text-6xl">
              {day}
            </span>
            <span className="font-outfit 3xl:text-sm 4xl:text-base 5xl:text-lg mt-1 text-[0.7rem] font-extrabold tracking-widest text-zinc-500 uppercase sm:text-xs">
              {month} {year}
            </span>
          </div>

          <div className="3xl:w-12 4xl:w-16 5xl:w-20 mt-2 hidden h-0.5 w-8 bg-zinc-200 md:block" />

          <div className="3xl:text-xs 4xl:text-sm 5xl:text-base mt-1 flex items-center gap-1.5 text-[0.65rem] font-bold tracking-wider text-zinc-500 uppercase sm:text-[0.7rem]">
            <Clock className="3xl:h-4.5 3xl:w-4.5 4xl:h-5 4xl:w-5 5xl:h-6 5xl:w-6 h-3.5 w-3.5 text-zinc-400" />
            <span>{post.readingTime}</span>
          </div>
        </div>

        {/* Main content body */}
        <div className="3xl:gap-5 flex flex-1 flex-col gap-3">
          {/* Category tag and title */}
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="3xl:text-sm 4xl:text-base 5xl:text-lg text-[0.65rem] font-extrabold tracking-widest text-zinc-500 uppercase sm:text-xs">
                {post.category}
              </span>
              {post.preview && (
                <span className="3xl:text-[14px] 3xl:px-3 3xl:py-1 3xl:gap-1.5 4xl:text-[18px] 4xl:px-4 4xl:py-1.5 4xl:gap-2 5xl:text-[22px] 5xl:px-5 5xl:py-2 5xl:gap-2.5 inline-flex shrink-0 items-center gap-1 rounded-full border border-red-500/20 bg-red-500/5 px-2 py-0.5 text-[9px] font-bold tracking-wider text-red-700 uppercase select-none">
                  <span className="3xl:h-2 3xl:w-2 4xl:h-2.5 4xl:w-2.5 5xl:h-3 5xl:w-3 h-1 w-1 rounded-full bg-red-500" />
                  Preview
                </span>
              )}
            </div>
            <HeadingTag className="font-outfit 3xl:text-3xl 4xl:text-4xl 5xl:text-5xl text-xl leading-tight font-bold tracking-tight text-black transition-colors group-hover/blog:text-zinc-800 sm:text-2xl">
              {post.title}
            </HeadingTag>
          </div>

          {/* Excerpt */}
          <p className="3xl:text-lg 4xl:text-xl 5xl:text-2xl text-sm leading-relaxed text-zinc-500 sm:text-base">
            {post.excerpt}
          </p>

          {/* Tags & Action Row */}
          <div className="3xl:mt-4 3xl:pt-6 flex flex-col gap-4 border-t border-zinc-100/50 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
            {/* Tags */}
            <div className="3xl:gap-2.5 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="3xl:text-sm 4xl:text-base 5xl:text-lg 3xl:px-4 3xl:py-1 4xl:px-5 4xl:py-1.5 5xl:px-6 5xl:py-2 rounded-full border border-zinc-200/50 bg-zinc-100/50 px-2.5 py-0.5 text-[0.65rem] font-semibold text-zinc-500 sm:text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Read Link */}
            <div className="flex items-center">
              <Link
                href={`/blog/${post.slug}`}
                onClick={(e) => handleNavigation(e, `/blog/${post.slug}`)}
                aria-label={`Read article: ${post.title}`}
                className="group/link 3xl:text-base 4xl:text-lg 5xl:text-xl inline-flex items-center gap-1.5 rounded-sm text-sm font-bold text-black transition-colors after:absolute after:inset-0 after:z-10 hover:text-zinc-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                <span>Read Article</span>
                <span className="sr-only">: {post.title}</span>
                <ArrowRight className="3xl:h-5 3xl:w-5 4xl:h-6 4xl:w-6 5xl:h-7 5xl:w-7 h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogRowSkeleton() {
  return (
    <div className="group/blog relative w-full animate-pulse pt-1 pb-1">
      <div className="3xl:p-10 4xl:p-12 5xl:p-16 3xl:gap-10 relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-zinc-200/40 bg-white/20 p-8 shadow-xs md:flex-row md:items-start md:gap-8">
        {/* Date stamp sidebar */}
        <div className="border-zinc-150/50 3xl:w-48 4xl:w-56 5xl:w-64 3xl:pr-10 4xl:pr-12 5xl:pr-16 flex flex-row items-center justify-between border-b pb-4 md:w-36 md:shrink-0 md:flex-col md:items-start md:gap-2 md:border-r md:border-b-0 md:pr-6 md:pb-0">
          <div className="flex flex-col items-start gap-2">
            <div className="h-10 w-12 rounded-lg bg-zinc-200/60" />
            <div className="h-3 w-16 rounded-md bg-zinc-200/60" />
          </div>
          <div className="mt-2 hidden h-0.5 w-8 bg-zinc-100 md:block" />
          <div className="h-3 w-16 rounded-md bg-zinc-200/60" />
        </div>

        {/* Main content body */}
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="h-3 w-20 rounded-md bg-zinc-200/60" />
            <div className="h-6 w-3/4 rounded-lg bg-zinc-200/80" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-4 w-full rounded-md bg-zinc-200/50" />
            <div className="h-4 w-5/6 rounded-md bg-zinc-200/50" />
          </div>
          <div className="flex flex-col gap-4 border-t border-zinc-100/50 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
            <div className="flex flex-wrap gap-1.5">
              <div className="h-5 w-12 rounded-full bg-zinc-200/50" />
              <div className="h-5 w-16 rounded-full bg-zinc-200/50" />
              <div className="h-5 w-14 rounded-full bg-zinc-200/50" />
            </div>
            <div className="h-4 w-24 rounded-md bg-zinc-200/60" />
          </div>
        </div>
      </div>
    </div>
  );
}

export interface BlogSectionProps {
  posts: BlogPost[];
  title?: string;
  subtitle?: string;
  isPreview?: boolean;
  showHeader?: boolean;
  isDbOffline?: boolean;
  isLoading?: boolean;
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

export default function BlogSection({
  posts = [],
  title = "Latest Articles",
  subtitle = "Thoughts & Ideas",
  isPreview = false,
  showHeader = true,
  isDbOffline = false,
  isLoading = false,
}: BlogSectionProps) {
  const [visibleCount, setVisibleCount] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const { ref, visible: revealVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.05 });
  const visible = revealVisible;

  // Extract unique categories dynamically
  const allCategories = useMemo(() => {
    const categoriesSet = new Set<string>();
    posts.forEach((p) => {
      if (p.category) {
        categoriesSet.add(p.category);
      }
    });
    return Array.from(categoriesSet).sort();
  }, [posts]);

  // Filter posts based on search query and selected category
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory = !selectedCategory || post.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  // Sort posts based on chosen criteria
  const sortedPosts = useMemo(() => {
    const list = [...filteredPosts];
    if (sortBy === "relevance" && searchQuery) {
      list.sort((a, b) => {
        const scoreA = getRelevanceScore(a.title, a.excerpt, a.content, searchQuery);
        const scoreB = getRelevanceScore(b.title, b.excerpt, b.content, searchQuery);
        return scoreB - scoreA;
      });
    } else if (sortBy === "newest") {
      list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (sortBy === "oldest") {
      list.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
    } else if (sortBy === "alphabetical-asc") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "alphabetical-desc") {
      list.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === "reading-time-asc") {
      list.sort((a, b) => {
        const aMin = parseInt(a.readingTime) || 0;
        const bMin = parseInt(b.readingTime) || 0;
        return aMin - bMin;
      });
    } else if (sortBy === "reading-time-desc") {
      list.sort((a, b) => {
        const aMin = parseInt(a.readingTime) || 0;
        const bMin = parseInt(b.readingTime) || 0;
        return bMin - aMin;
      });
    }
    return list;
  }, [filteredPosts, sortBy, searchQuery]);

  // Show top 3 in preview, otherwise render up to visibleCount
  const displayedPosts = isPreview ? sortedPosts.slice(0, 3) : sortedPosts.slice(0, visibleCount);

  return (
    <section
      id="blog"
      aria-label="Blog Showcase"
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

        {/* Search and Filters (Full page showcase only) */}
        {!isPreview && posts.length > 0 && (
          <div className="flex flex-col gap-6 border-b border-zinc-200/50 pb-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Search Input */}
              <div className="relative w-full md:max-w-xs">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Search className="h-4 w-4 text-zinc-400" />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    const newVal = e.target.value;
                    setSearchQuery(newVal);
                    setVisibleCount(5);
                    if (newVal && sortBy !== "relevance") {
                      setSortBy("relevance");
                    } else if (!newVal && sortBy === "relevance") {
                      setSortBy("newest");
                    }
                  }}
                  placeholder="Search articles..."
                  className="w-full rounded-full border border-zinc-200/60 bg-white/40 py-2.5 pr-10 pl-10 text-sm font-medium shadow-2xs transition-all duration-300 placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white/80 focus:ring-2 focus:ring-black focus:outline-hidden"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setVisibleCount(5);
                      if (sortBy === "relevance") {
                        setSortBy("newest");
                      }
                    }}
                    className="absolute inset-y-0 right-0 flex items-center rounded-full pr-3.5 text-zinc-400 transition-colors hover:text-black focus:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                    aria-label="Clear Search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative self-end md:self-auto">
                <button
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  aria-haspopup="listbox"
                  aria-expanded={sortDropdownOpen}
                  className="flex items-center gap-2 rounded-full border border-zinc-200/60 bg-white/40 px-5 py-2.5 text-sm font-semibold text-zinc-700 shadow-2xs transition-all duration-300 select-none hover:border-zinc-300 hover:bg-white/85 focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
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
                            : sortBy === "alphabetical-desc"
                              ? "Z-A"
                              : sortBy === "reading-time-asc"
                                ? "Reading Time (Short)"
                                : "Reading Time (Long)"}
                  </span>
                  <ChevronDown
                    className={`text-zinc-555 h-4 w-4 transition-transform duration-300 ${sortDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {sortDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setSortDropdownOpen(false)}
                    />
                    <div
                      role="listbox"
                      className="animate-in fade-in slide-in-from-top-2 absolute right-0 z-30 mt-2 w-56 rounded-2xl border border-zinc-200/80 bg-white/95 py-1.5 shadow-lg backdrop-blur-md duration-200"
                    >
                      {searchQuery && (
                        <button
                          role="option"
                          aria-selected={sortBy === "relevance"}
                          onClick={() => {
                            setSortBy("relevance");
                            setVisibleCount(5);
                            setSortDropdownOpen(false);
                          }}
                          className="text-zinc-750 flex w-full items-center justify-between rounded-t-xl px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-black/5 focus:outline-hidden focus-visible:bg-black/5 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset"
                        >
                          <span>Relevance</span>
                          {sortBy === "relevance" && <Check className="h-4 w-4 text-black" />}
                        </button>
                      )}
                      <button
                        role="option"
                        aria-selected={sortBy === "newest"}
                        onClick={() => {
                          setSortBy("newest");
                          setVisibleCount(5);
                          setSortDropdownOpen(false);
                        }}
                        className={`text-zinc-750 flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-black/5 focus:outline-hidden focus-visible:bg-black/5 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset ${!searchQuery ? "rounded-t-xl" : ""}`}
                      >
                        <span>Newest First</span>
                        {sortBy === "newest" && <Check className="h-4 w-4 text-black" />}
                      </button>
                      <button
                        role="option"
                        aria-selected={sortBy === "oldest"}
                        onClick={() => {
                          setSortBy("oldest");
                          setVisibleCount(5);
                          setSortDropdownOpen(false);
                        }}
                        className="text-zinc-750 flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-black/5 focus:outline-hidden focus-visible:bg-black/5 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset"
                      >
                        <span>Oldest First</span>
                        {sortBy === "oldest" && <Check className="h-4 w-4 text-black" />}
                      </button>
                      <button
                        role="option"
                        aria-selected={sortBy === "alphabetical-asc"}
                        onClick={() => {
                          setSortBy("alphabetical-asc");
                          setVisibleCount(5);
                          setSortDropdownOpen(false);
                        }}
                        className="text-zinc-750 flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-black/5 focus:outline-hidden focus-visible:bg-black/5 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset"
                      >
                        <span>A-Z</span>
                        {sortBy === "alphabetical-asc" && <Check className="h-4 w-4 text-black" />}
                      </button>
                      <button
                        role="option"
                        aria-selected={sortBy === "alphabetical-desc"}
                        onClick={() => {
                          setSortBy("alphabetical-desc");
                          setVisibleCount(5);
                          setSortDropdownOpen(false);
                        }}
                        className="text-zinc-750 flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-black/5 focus:outline-hidden focus-visible:bg-black/5 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset"
                      >
                        <span>Z-A</span>
                        {sortBy === "alphabetical-desc" && <Check className="h-4 w-4 text-black" />}
                      </button>
                      <button
                        role="option"
                        aria-selected={sortBy === "reading-time-asc"}
                        onClick={() => {
                          setSortBy("reading-time-asc");
                          setVisibleCount(5);
                          setSortDropdownOpen(false);
                        }}
                        className="text-zinc-750 flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-black/5 focus:outline-hidden focus-visible:bg-black/5 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset"
                      >
                        <span>Reading Time (Short)</span>
                        {sortBy === "reading-time-asc" && <Check className="h-4 w-4 text-black" />}
                      </button>
                      <button
                        role="option"
                        aria-selected={sortBy === "reading-time-desc"}
                        onClick={() => {
                          setSortBy("reading-time-desc");
                          setVisibleCount(5);
                          setSortDropdownOpen(false);
                        }}
                        className="text-zinc-750 flex w-full items-center justify-between rounded-b-xl px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-black/5 focus:outline-hidden focus-visible:bg-black/5 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset"
                      >
                        <span>Reading Time (Long)</span>
                        {sortBy === "reading-time-desc" && <Check className="h-4 w-4 text-black" />}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Category Filter pills */}
            <div
              role="group"
              aria-label="Filter by category"
              className="no-scrollbar flex flex-wrap items-center gap-2 overflow-x-auto py-1"
            >
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setVisibleCount(5);
                }}
                aria-pressed={selectedCategory === null}
                className={`rounded-full border px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all duration-300 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
                  selectedCategory === null
                    ? "border-black bg-black text-white"
                    : "text-zinc-550 border-zinc-200 bg-white/40 hover:border-zinc-300 hover:bg-white/85 hover:text-black"
                }`}
              >
                All
              </button>
              {allCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setVisibleCount(5);
                  }}
                  aria-pressed={selectedCategory === category}
                  className={`rounded-full border px-4 py-2 text-xs font-bold tracking-wider whitespace-nowrap uppercase transition-all duration-300 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
                    selectedCategory === category
                      ? "border-black bg-black text-white"
                      : "text-zinc-555 border-zinc-200 bg-white/40 hover:border-zinc-300 hover:bg-white/85 hover:text-black"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Blog Posts Rows / Empty State */}
        {isLoading ? (
          <div className="flex animate-pulse flex-col gap-6">
            <BlogRowSkeleton />
            <BlogRowSkeleton />
            <BlogRowSkeleton />
          </div>
        ) : isDbOffline ? (
          <DbOfflineMessage
            title="Articles Unavailable"
            description="We could not load the blog articles because the database is unavailable."
          />
        ) : posts.length === 0 ? (
          <div className="3xl:p-16 3xl:rounded-3xl 3xl:border-2 4xl:p-20 4xl:rounded-4xl 5xl:p-28 5xl:rounded-[3rem] flex flex-col items-center justify-center rounded-2xl border border-zinc-200/60 bg-white/40 p-8 text-center shadow-xs backdrop-blur-md transition-all duration-300 md:p-12">
            <div className="text-zinc-650 3xl:h-20 3xl:w-20 3xl:mb-6 4xl:h-24 4xl:w-24 4xl:mb-8 5xl:h-32 5xl:w-32 5xl:mb-12 relative mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100">
              <Search className="3xl:h-9 3xl:w-9 4xl:h-11 4xl:w-11 5xl:h-16 5xl:w-16 h-6 w-6" />
            </div>
            <h3 className="font-outfit 3xl:text-2xl 4xl:text-3xl 5xl:text-4xl text-lg font-bold text-black sm:text-xl">
              No Articles Found
            </h3>
            <p className="text-zinc-550 3xl:mt-4 3xl:text-lg 3xl:max-w-xl 4xl:mt-5 4xl:text-xl 4xl:max-w-2xl 5xl:mt-6 5xl:text-2xl 5xl:max-w-4xl mt-2 max-w-md text-sm leading-relaxed sm:text-base">
              There are currently no articles published. Please check back later.
            </p>
          </div>
        ) : sortedPosts.length === 0 ? (
          <div className="3xl:p-16 3xl:rounded-3xl 3xl:border-2 4xl:p-20 4xl:rounded-4xl 5xl:p-28 5xl:rounded-[3rem] flex flex-col items-center justify-center rounded-2xl border border-zinc-200/60 bg-white/40 p-8 text-center shadow-xs backdrop-blur-md transition-all duration-300 md:p-12">
            <div className="text-zinc-650 3xl:h-20 3xl:w-20 3xl:mb-6 4xl:h-24 4xl:w-24 4xl:mb-8 5xl:h-32 5xl:w-32 5xl:mb-12 relative mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100">
              <Search className="3xl:h-9 3xl:w-9 4xl:h-11 4xl:w-11 5xl:h-16 5xl:w-16 h-6 w-6" />
            </div>
            <h3 className="font-outfit 3xl:text-2xl 4xl:text-3xl 5xl:text-4xl text-lg font-bold text-black sm:text-xl">
              No Articles Found
            </h3>
            <p className="text-zinc-550 3xl:mt-4 3xl:text-lg 3xl:max-w-xl 4xl:mt-5 4xl:text-xl 4xl:max-w-2xl 5xl:mt-6 5xl:text-2xl 5xl:max-w-4xl mt-2 max-w-md text-sm leading-relaxed sm:text-base">
              We couldn&apos;t find any articles matching your search criteria. Try modifying your
              search or filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
                setSortBy("newest");
                setVisibleCount(5);
              }}
              className="3xl:mt-8 3xl:px-8 3xl:py-3.5 3xl:text-sm 3xl:gap-3 4xl:mt-10 4xl:px-10 4xl:py-4.5 4xl:text-base 4xl:gap-3.5 5xl:mt-14 5xl:px-14 5xl:py-6 5xl:text-lg 5xl:gap-4 mt-6 inline-flex items-center gap-2 rounded-full border border-black bg-black px-6 py-2.5 text-xs font-bold tracking-wider text-white uppercase transition-all duration-300 hover:bg-zinc-900 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-[3px]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-6">
              {displayedPosts.map((post, idx) => (
                <BlogRow
                  key={post.slug}
                  post={post}
                  visible={visible}
                  delay={(idx % 5) * 150}
                  headingLevel={showHeader ? "h3" : "h2"}
                />
              ))}
            </div>

            {/* Load More Button (Full page blog showcase only) */}
            {!isPreview && visibleCount < sortedPosts.length && (
              <div className="mt-8 flex justify-center">
                <CTAButton
                  text="Load More Articles"
                  type="load-more"
                  onClick={() => setVisibleCount((prev) => prev + 5)}
                />
              </div>
            )}
          </>
        )}

        {/* View All Articles Button (Home page preview only) */}
        {isPreview && posts.length > 0 && (
          <div className="mt-4 flex justify-center md:justify-start">
            <CTAButton text="View All Articles" href="/blog" />
          </div>
        )}
      </div>
    </section>
  );
}
