"use client";

import { useEffect, useState } from "react";
import { type BlogPost } from "../data/blog";
import { footerNavGroups, footerSocials, navItems } from "../data/portfolio";
import BackButton from "./BackButton";
import BlogSection from "./BlogSection";
import Footer from "./Footer";
import Header from "./Header";

export default function BlogPageClient() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => {
        if (!res.ok) {
          setDbError(true);
          setLoading(false);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data === null) return;
        const formatted = Array.isArray(data)
          ? (data as BlogPost[]).map((post) => ({
              ...post,
              tags: Array.isArray(post.tags) ? post.tags : [],
            }))
          : [];
        setPosts(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
        setDbError(true);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Header */}
      <Header navItems={navItems} ctaText="Get in touch?" ctaHref="/#contact" />

      {/* Main Content Area */}
      <main
        id="main-content"
        role="main"
        className="3xl:max-w-440 4xl:max-w-560 5xl:max-w-720 3xl:pt-36 4xl:pt-40 5xl:pt-44 mx-auto flex w-full flex-col px-4 pt-20 pb-8 font-sans transition-colors duration-500 ease-in-out sm:max-w-screen-sm sm:pt-24 md:max-w-3xl md:pt-28 md:pb-16 lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl"
      >
        {/* Page Header block including Back Button */}
        <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-b border-zinc-200/50 pb-6">
          <div className="flex flex-col gap-2 text-left">
            <span className="3xl:text-sm 4xl:text-base 5xl:text-lg text-xs font-bold tracking-widest text-zinc-500 uppercase">
              Insights & Ideas
            </span>
            <h1 className="3xl:text-5xl 4xl:text-6xl 5xl:text-7xl text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
              Blog & Articles
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <BackButton variant="rss" href="/feed.xml" label="RSS Feed" />
            <BackButton />
          </div>
        </div>

        {/* Full Blog Listing Showcase without internal header */}
        <BlogSection
          posts={posts}
          isPreview={false}
          showHeader={false}
          isDbOffline={dbError}
          isLoading={loading}
        />
      </main>

      {/* Footer Area */}
      <Footer navGroups={footerNavGroups} socials={footerSocials} />
    </div>
  );
}
