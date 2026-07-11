/**
 * @file page.tsx
 * @description Dynamic blog post detail page (route: /blog/[slug]).
 */

import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "../../../lib/db";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import BackButton from "../../../components/BackButton";
import Markdown from "../../../components/Markdown";
import DbOfflineMessage from "../../../components/DbOfflineMessage";
import { navItems, footerNavGroups, footerSocials } from "../../../data/portfolio";
import { parseDate } from "../../../lib/utils";
import { Calendar, ChevronRight, Clock, Tag } from "lucide-react";

import { cookies } from "next/headers";
import { type BlogPost } from "../../../data/blog";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });
    if (!post) {
      return {
        title: "Article Not Found",
      };
    }

    if (post.preview) {
      const cookieStore = await cookies();
      const adminSession = cookieStore.get("admin_session")?.value;
      const ownerAccount = process.env.ADMIN_OWNER_ACCOUNT || "tristanbudd";
      const isAdmin = adminSession === ownerAccount;
      if (!isAdmin) {
        return {
          title: "Article Not Found",
        };
      }
    }

    return {
      title: post.title,
      description: post.excerpt,
    };
  } catch {
    return {
      title: "Blog",
    };
  }
}

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  let dbPost = null;
  let dbError = false;

  try {
    dbPost = await prisma.blogPost.findUnique({
      where: { slug },
    });
  } catch (error) {
    console.warn("Warning: Database connection failed on blog detail query.", error);
    dbError = true;
  }

  if (dbError) {
    return (
      <div className="bg-background flex min-h-screen flex-col">
        {/* Header */}
        <Header navItems={navItems} ctaText="Get in touch?" ctaHref="/#contact" />

        {/* Main Content Area */}
        <main
          role="main"
          className="3xl:max-w-6xl 4xl:max-w-7xl 5xl:max-w-8xl 3xl:pt-40 4xl:pt-44 5xl:pt-48 3xl:pb-10 4xl:pb-12 5xl:pb-16 mx-auto flex w-full max-w-4xl flex-col px-4 pt-24 pb-6 font-sans transition-all duration-500 ease-in-out sm:pt-28 md:pt-32 md:pb-8 lg:max-w-5xl lg:pt-36"
        >
          <div className="mt-8 flex flex-col items-center justify-center">
            <DbOfflineMessage
              title="Article Unavailable"
              description="This article could not be loaded because the database is currently offline. Please try again later."
            />
            <div className="mt-8">
              <BackButton href="/blog" label="Back to Blog" />
            </div>
          </div>
        </main>

        {/* Footer Area */}
        <Footer navGroups={footerNavGroups} socials={footerSocials} />
      </div>
    );
  }

  if (!dbPost) {
    redirect("/not-found");
  }

  if (dbPost.preview) {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin_session")?.value;
    const ownerAccount = process.env.ADMIN_OWNER_ACCOUNT || "tristanbudd";
    const isAdmin = adminSession === ownerAccount;
    if (!isAdmin) {
      redirect("/not-found");
    }
  }

  const post: BlogPost = {
    ...dbPost,
    tags: Array.isArray(dbPost.tags) ? (dbPost.tags as string[]) : [],
  } as unknown as BlogPost;

  const { month, day, year } = parseDate(post.publishedAt);

  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Header */}
      <Header navItems={navItems} ctaText="Get in touch?" ctaHref="/#contact" />

      {/* Main Content Area */}
      <main
        role="main"
        className="3xl:max-w-6xl 4xl:max-w-7xl 5xl:max-w-8xl 3xl:pt-40 4xl:pt-44 5xl:pt-48 3xl:pb-10 4xl:pb-12 5xl:pb-16 mx-auto flex w-full max-w-4xl flex-col px-4 pt-24 pb-6 font-sans transition-all duration-500 ease-in-out sm:pt-28 md:pt-32 md:pb-8 lg:max-w-5xl lg:pt-36"
      >
        {/* Breadcrumbs */}
        <nav className="3xl:mb-12 4xl:mb-14 5xl:mb-16 3xl:text-sm 4xl:text-base 5xl:text-lg mb-6 flex flex-wrap items-center gap-1.5 text-xs leading-normal font-semibold tracking-wide text-zinc-500 uppercase sm:mb-8 md:mb-8 lg:mb-10">
          <Link href="/" className="transition-colors hover:text-black">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-zinc-400" />
          <Link href="/blog" className="transition-colors hover:text-black">
            Blog
          </Link>
          <ChevronRight className="h-3 w-3 text-zinc-400" />
          <span className="max-w-[150px] truncate text-zinc-400 sm:max-w-xs md:max-w-md lg:max-w-lg">
            {post.title}
          </span>
        </nav>

        {/* Article Header block */}
        <header className="3xl:mb-16 mb-10 flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-zinc-650 3xl:px-4 3xl:py-1.5 3xl:text-sm 4xl:px-5 4xl:py-2 4xl:text-base 5xl:px-6 5xl:py-2.5 5xl:text-lg rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-xs font-bold tracking-wider uppercase shadow-xs">
              {post.category}
            </span>
            {post.preview && (
              <span className="3xl:text-[14px] 3xl:px-3 3xl:py-1 3xl:gap-1.5 4xl:text-[18px] 4xl:px-4 4xl:py-1.5 4xl:gap-2 5xl:text-[22px] 5xl:px-5 5xl:py-2 5xl:gap-2.5 inline-flex shrink-0 items-center gap-1 rounded-full border border-red-500/20 bg-red-500/5 px-2 py-0.5 text-[9px] font-bold tracking-wider text-red-700 uppercase select-none">
                <span className="3xl:h-2 3xl:w-2 4xl:h-2.5 4xl:w-2.5 5xl:h-3 5xl:w-3 h-1 w-1 rounded-full bg-red-500" />
                Preview
              </span>
            )}
          </div>

          <h1 className="font-outfit 3xl:text-6xl 4xl:text-7xl 5xl:text-8xl text-3xl font-extrabold tracking-tight text-black sm:text-4xl md:text-5xl md:leading-tight">
            {post.title}
          </h1>

          <p className="3xl:text-2xl 4xl:text-3xl 5xl:text-4xl text-lg leading-relaxed font-medium text-zinc-500 md:text-xl">
            {post.excerpt}
          </p>

          {/* Meta Info Row */}
          <div className="3xl:py-6 3xl:text-base 4xl:py-8 4xl:text-lg 5xl:py-10 5xl:text-xl flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-zinc-200/60 py-4 text-sm font-medium text-zinc-500">
            <div className="flex items-center gap-2">
              <Calendar className="3xl:h-5 3xl:w-5 4xl:h-6 4xl:w-6 5xl:h-7 5xl:w-7 h-4 w-4 text-zinc-400" />
              <span>
                {month} {day}, {year}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="3xl:h-5 3xl:w-5 4xl:h-6 4xl:w-6 5xl:h-7 5xl:w-7 h-4 w-4 text-zinc-400" />
              <span>{post.readingTime}</span>
            </div>
          </div>
        </header>

        {/* Editorial Markdown Body */}
        <article className="w-full">
          <Markdown content={post.content} className="3xl:text-lg 4xl:text-xl 5xl:text-2xl" />
        </article>

        {/* Tags footer */}
        {post.tags && post.tags.length > 0 && (
          <div className="3xl:mt-16 3xl:pt-10 mt-12 w-full border-t border-zinc-200/60 pt-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <Tag className="3xl:h-5 3xl:w-5 4xl:h-6 4xl:w-6 5xl:h-7 5xl:w-7 h-4 w-4 text-zinc-400" />
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="3xl:px-3.5 3xl:py-1 3xl:text-sm 4xl:px-4 4xl:py-1.5 4xl:text-base 5xl:px-5 5xl:py-2 5xl:text-lg rounded-full border border-zinc-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-zinc-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Back navigation CTA */}
        <div className="3xl:mt-24 mt-16 flex w-full justify-start">
          <BackButton
            href="/blog"
            label="Back to Blog"
            className="w-full justify-center py-3 sm:w-auto sm:px-4 sm:py-2.5"
          />
        </div>
      </main>

      {/* Footer Area */}
      <Footer navGroups={footerNavGroups} socials={footerSocials} />
    </div>
  );
}
