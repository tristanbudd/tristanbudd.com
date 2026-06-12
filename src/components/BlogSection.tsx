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

import { parseDate } from "@/lib/utils";

function BlogRow({ post, visible, delay }: { post: BlogPost; visible: boolean; delay: number }) {
  const { month, day, year } = parseDate(post.publishedAt);

  return (
    <div
      className="group/blog 3xl:p-10 4xl:p-12 5xl:p-16 relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-zinc-200/60 bg-white/40 p-8 shadow-xs backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-zinc-300 hover:bg-white/80 hover:shadow-md md:flex-row md:items-start md:gap-8"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, box-shadow 0.3s ease, border-color 0.3s ease, background-color 0.3s ease, transform 0.3s ease`,
      }}
    >
      {/* Top slide-in border line */}
      <div className="absolute top-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-linear-to-r from-zinc-700 via-black to-zinc-800 transition-transform duration-300 group-hover/blog:scale-x-100" />

      {/* Date stamp sidebar */}
      <div className="border-zinc-150 flex flex-row items-center justify-between border-b pb-4 md:w-36 md:shrink-0 md:flex-col md:items-start md:gap-1 md:border-r md:border-b-0 md:border-zinc-200/60 md:pr-6 md:pb-0">
        <div className="flex flex-col items-start leading-none">
          <span className="font-outfit text-5xl leading-none font-extrabold tracking-tight text-black sm:text-6xl">
            {day}
          </span>
          <span className="font-outfit mt-1 text-[0.7rem] font-extrabold tracking-widest text-zinc-400 uppercase sm:text-xs">
            {month} {year}
          </span>
        </div>

        <div className="mt-2 hidden h-[2px] w-8 bg-zinc-200 md:block" />

        <div className="mt-1 flex items-center gap-1.5 text-[0.65rem] font-bold tracking-wider text-zinc-500 uppercase sm:text-[0.7rem]">
          <Clock className="h-3.5 w-3.5 text-zinc-400" />
          <span>{post.readingTime}</span>
        </div>
      </div>

      {/* Main content body */}
      <div className="flex flex-1 flex-col gap-3">
        {/* Category tag and title */}
        <div className="flex flex-col gap-1">
          <span className="text-[0.65rem] font-extrabold tracking-widest text-zinc-400 uppercase sm:text-xs">
            {post.category}
          </span>
          <h3 className="font-outfit text-xl leading-tight font-bold tracking-tight text-black transition-colors group-hover/blog:text-zinc-800 sm:text-2xl">
            {post.title}
          </h3>
        </div>

        {/* Excerpt */}
        <p className="text-sm leading-relaxed text-zinc-500 sm:text-base">{post.excerpt}</p>

        {/* Tags & Action Row */}
        <div className="flex flex-col gap-4 border-t border-zinc-100/50 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-zinc-200/50 bg-zinc-100/50 px-2.5 py-0.5 text-[0.65rem] font-semibold text-zinc-500 sm:text-xs"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Read Link */}
          <div className="flex items-center">
            <Link
              href={`/blog/${post.slug}`}
              className="group/link inline-flex items-center gap-1.5 text-sm font-bold text-black transition-colors after:absolute after:inset-0 after:z-10 hover:text-zinc-700"
            >
              <span>Read Article</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
            </Link>
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
  const { ref, visible: revealVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.05 });
  const visible = !isPreview || revealVisible;

  if (!posts.length) return null;

  // Show top 3 in preview, otherwise render all
  const displayedPosts = isPreview ? posts.slice(0, 3) : posts;

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
            <BlogRow key={post.slug} post={post} visible={visible} delay={idx * 150} />
          ))}
        </div>

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
