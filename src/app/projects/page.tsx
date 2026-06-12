/**
 * @file page.tsx
 * @description All projects showcase page (route: /projects).
 */

import type { Metadata } from "next";
import BackButton from "../../components/BackButton";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Projects from "../../components/Projects";
import { footerNavGroups, footerSocials, navItems, projects } from "../../data/portfolio";

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore all portfolio projects built by Tristan Budd.",
};

export default function ProjectsPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Header */}
      <Header navItems={navItems} ctaText="Placeholder CTA" ctaHref="#" />

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
        <Projects projects={projects} isPreview={false} showHeader={false} />
      </main>

      {/* Footer Area */}
      <Footer navGroups={footerNavGroups} socials={footerSocials} />
    </div>
  );
}
