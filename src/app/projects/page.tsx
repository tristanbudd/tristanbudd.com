/**
 * @file page.tsx
 * @description All projects showcase page (route: /projects).
 */

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Header from "../../components/Header";
import Projects from "../../components/Projects";
import { navItems, projects } from "../../data/portfolio";

export const metadata = {
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
        className="3xl:max-w-440 4xl:max-w-560 5xl:max-w-720 mx-auto flex w-full flex-col px-4 pt-24 pb-8 font-sans transition-all duration-500 ease-in-out sm:max-w-screen-sm md:max-w-3xl md:pt-28 md:pb-16 lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl"
      >
        {/* Back Link */}
        <div className="mt-8">
          <Link
            href="/"
            className="group text-zinc-650 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/60 px-4 py-1.5 text-sm font-semibold shadow-xs backdrop-blur-xs transition-all duration-300 hover:border-zinc-400 hover:bg-white hover:text-black hover:shadow-sm"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Full Projects Showcase */}
        <Projects projects={projects} title="All Projects" subtitle="Showcase" isPreview={false} />
      </main>

      {/* Footer Area */}
      <footer
        role="contentinfo"
        aria-label="Footer"
        className="mx-auto w-full px-4 pb-8 transition-all duration-500 ease-in-out sm:max-w-screen-sm md:max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl"
      >
        <div className="text-secondary border-2 border-dashed border-zinc-400 bg-zinc-100/50 p-6 text-center text-sm font-medium">
          Footer
        </div>
      </footer>
    </div>
  );
}
