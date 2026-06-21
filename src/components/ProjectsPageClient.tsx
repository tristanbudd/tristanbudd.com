"use client";

import { useEffect, useState } from "react";
import BackButton from "./BackButton";
import Footer from "./Footer";
import Header from "./Header";
import ProjectSection from "./ProjectSection";
import { footerNavGroups, footerSocials, navItems } from "../data/portfolio";
import { type Project } from "../data/projects";

export default function ProjectsPageClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
    fetch("/api/projects")
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
          ? (data as Project[]).map((p) => ({
              ...p,
              tags: Array.isArray(p.tags) ? p.tags : [],
            }))
          : [];
        setProjects(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
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
        role="main"
        className="3xl:max-w-440 4xl:max-w-560 5xl:max-w-720 3xl:pt-36 4xl:pt-40 5xl:pt-44 mx-auto flex w-full flex-col px-4 pt-20 pb-8 font-sans transition-all duration-500 ease-in-out sm:max-w-screen-sm sm:pt-24 md:max-w-3xl md:pt-28 md:pb-16 lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl"
      >
        {/* Page Header block including Back Button */}
        <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-b border-zinc-200/50 pb-6">
          <div className="flex flex-col gap-2 text-left">
            <span className="3xl:text-sm 4xl:text-base 5xl:text-lg text-xs font-bold tracking-widest text-zinc-500 uppercase">
              Showcase
            </span>
            <h1 className="3xl:text-5xl 4xl:text-6xl 5xl:text-7xl text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
              All Projects
            </h1>
          </div>

          <div className="flex justify-start">
            <BackButton />
          </div>
        </div>

        {/* Full Projects Showcase without internal header */}
        <ProjectSection
          projects={projects}
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
