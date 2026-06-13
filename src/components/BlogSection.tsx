/**
 * @file BlogSection.tsx
 * @description Renders a list/preview of blog posts with a horizontal split-row editorial layout.
 */

"use client";

import { BlogPost } from "@/data/blog";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import CTAButton from "./CTAButton";
import { useState, useEffect } from "react";
import { parseDate } from "@/lib/utils";

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

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 30);
    return () => clearTimeout(timer);
  }, []);

  const isCardVisible = visible && animate;

  return (
    <div className="group/blog relative w-full pt-1 pb-1">
      <div
        className="3xl:p-10 4xl:p-12 5xl:p-16 3xl:gap-10 relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-zinc-200/60 bg-white/40 p-8 shadow-xs backdrop-blur-md transition-all duration-500 group-hover/blog:-translate-y-1 group-hover/blog:border-zinc-300 group-hover/blog:bg-white/80 group-hover/blog:shadow-md md:flex-row md:items-start md:gap-8"
        style={{
          opacity: isCardVisible ? 1 : 0,
          transform: isCardVisible ? "translateY(0)" : "translateY(24px)",
          transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, box-shadow 0.3s ease, border-color 0.3s ease, background-color 0.3s ease, transform 0.3s ease`,
        }}
      >
        {/* Top slide-in border line */}
        <div className="absolute top-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-linear-to-r from-zinc-700 via-black to-zinc-800 transition-transform duration-300 group-hover/blog:scale-x-100" />

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

          <div className="3xl:w-12 4xl:w-16 5xl:w-20 mt-2 hidden h-[2px] w-8 bg-zinc-200 md:block" />

          <div className="3xl:text-xs 4xl:text-sm 5xl:text-base mt-1 flex items-center gap-1.5 text-[0.65rem] font-bold tracking-wider text-zinc-500 uppercase sm:text-[0.7rem]">
            <Clock className="3xl:h-4.5 3xl:w-4.5 4xl:h-5 4xl:w-5 5xl:h-6 5xl:w-6 h-3.5 w-3.5 text-zinc-400" />
            <span>{post.readingTime}</span>
          </div>
        </div>

        {/* Main content body */}
        <div className="3xl:gap-5 flex flex-1 flex-col gap-3">
          {/* Category tag and title */}
          <div className="flex flex-col gap-1">
            <span className="3xl:text-sm 4xl:text-base 5xl:text-lg text-[0.65rem] font-extrabold tracking-widest text-zinc-500 uppercase sm:text-xs">
              {post.category}
            </span>
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
                aria-label={`Read article: ${post.title}`}
                className="group/link 3xl:text-base 4xl:text-lg 5xl:text-xl inline-flex items-center gap-1.5 text-sm font-bold text-black transition-colors after:absolute after:inset-0 after:z-10 hover:text-zinc-700"
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

export interface BlogSectionProps {
  posts: BlogPost[];
  title?: string;
  subtitle?: string;
  isPreview?: boolean;
  showHeader?: boolean;
}

export default function BlogSection({
  posts = [],
  title = "Latest Articles",
  subtitle = "Thoughts & Ideas",
  isPreview = false,
  showHeader = true,
}: BlogSectionProps) {
  const [visibleCount, setVisibleCount] = useState(5);
  const { ref, visible: revealVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.05 });
  const visible = revealVisible;

  if (!posts.length) return null;

  // Show top 3 in preview, otherwise render up to visibleCount
  const displayedPosts = isPreview ? posts.slice(0, 3) : posts.slice(0, visibleCount);

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
      <div className="flex flex-col gap-10">
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

        {/* Blog Posts Rows */}
        <div ref={ref} className="flex flex-col gap-6">
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
        {!isPreview && visibleCount < posts.length && (
          <div className="mt-8 flex justify-center">
            <CTAButton
              text="Load More Articles"
              type="load-more"
              onClick={() => setVisibleCount((prev) => prev + 5)}
            />
          </div>
        )}

        {/* View All Articles Button */}
        {isPreview && (
          <div className="mt-4 flex justify-center md:justify-start">
            <CTAButton text="View All Articles" href="/blog" />
          </div>
        )}
      </div>
    </section>
  );
}
