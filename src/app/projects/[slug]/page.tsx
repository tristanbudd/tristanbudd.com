/**
 * @file page.tsx
 * @description Dynamic projects case study page (route: /projects/[slug]).
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "../../../lib/db";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import BackButton from "../../../components/BackButton";
import Markdown from "../../../components/Markdown";
import DbOfflineMessage from "../../../components/DbOfflineMessage";
import { navItems, footerNavGroups, footerSocials } from "../../../data/portfolio";
import * as Icons from "lucide-react";
const { ChevronRight, ExternalLink, Github } = Icons;
import { type Project, type CustomField } from "../../../data/projects";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const project = await prisma.project.findUnique({
      where: { slug },
    });
    if (!project) {
      return {
        title: "Project Not Found",
      };
    }
    return {
      title: project.title,
      description: project.description,
    };
  } catch {
    return {
      title: "Project Showcase",
    };
  }
}

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let dbProject = null;
  let dbError = false;

  try {
    dbProject = await prisma.project.findUnique({
      where: { slug },
    });
  } catch (error) {
    console.warn("Warning: Database connection failed on project detail query.", error);
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
          className="3xl:max-w-440 4xl:max-w-560 5xl:max-w-720 3xl:pt-40 4xl:pt-44 5xl:pt-48 3xl:pb-10 4xl:pb-12 5xl:pb-16 mx-auto flex w-full flex-col px-4 pt-24 pb-6 font-sans transition-all duration-500 ease-in-out sm:max-w-screen-sm sm:pt-28 md:max-w-3xl md:pt-32 md:pb-8 lg:max-w-5xl lg:pt-36 xl:max-w-6xl 2xl:max-w-7xl"
        >
          <div className="mt-8 flex flex-col items-center justify-center">
            <DbOfflineMessage
              title="Project Unavailable"
              description="This case study could not be loaded because the database is currently offline. Please try again later."
            />
            <div className="mt-8">
              <BackButton href="/projects" label="Back to Projects" />
            </div>
          </div>
        </main>

        {/* Footer Area */}
        <Footer navGroups={footerNavGroups} socials={footerSocials} />
      </div>
    );
  }

  if (!dbProject) {
    notFound();
  }

  const project: Project = {
    ...dbProject,
    tags: Array.isArray(dbProject.tags) ? (dbProject.tags as string[]) : [],
    customFields: (dbProject as unknown as { customFields?: CustomField[] }).customFields,
  };

  // Generate fallback markdown if no extendedDescription is present
  const content =
    project.extendedDescription ||
    `
# Case Study: ${project.title}

${project.description}

---

## Project Stack & Details

This project was built with the following core stack:
${project.tags.map((tag) => `- **${tag}**`).join("\n")}

You can explore the source code in the [GitHub Repository](${
      project.githubUrl || "https://github.com/tristanbudd"
    }) or view the [live application website](${project.projectUrl || "#"}) to see it in action.
`;

  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Header */}
      <Header navItems={navItems} ctaText="Get in touch?" ctaHref="/#contact" />

      {/* Main Content Area */}
      <main
        role="main"
        className="3xl:max-w-440 4xl:max-w-560 5xl:max-w-720 3xl:pt-40 4xl:pt-44 5xl:pt-48 3xl:pb-10 4xl:pb-12 5xl:pb-16 mx-auto flex w-full flex-col px-4 pt-24 pb-6 font-sans transition-all duration-500 ease-in-out sm:max-w-screen-sm sm:pt-28 md:max-w-3xl md:pt-32 md:pb-8 lg:max-w-5xl lg:pt-36 xl:max-w-6xl 2xl:max-w-7xl"
      >
        {/* Breadcrumbs */}
        <nav className="3xl:mb-12 4xl:mb-14 5xl:mb-16 3xl:text-sm 4xl:text-base 5xl:text-lg mb-6 flex flex-wrap items-center gap-1.5 text-xs leading-normal font-semibold tracking-wide text-zinc-500 uppercase sm:mb-8 md:mb-8 lg:mb-10">
          <Link href="/" className="transition-colors hover:text-black">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-zinc-400" />
          <Link href="/projects" className="transition-colors hover:text-black">
            Projects
          </Link>
          <ChevronRight className="h-3 w-3 text-zinc-400" />
          <span className="max-w-[150px] truncate text-zinc-400 sm:max-w-xs md:max-w-md lg:max-w-lg">
            {project.title}
          </span>
        </nav>

        {/* Dual Column Layout */}
        <div className="3xl:gap-16 4xl:gap-20 5xl:gap-24 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12">
          {/* Sidebar / Specs (4 cols on lg screens, sticky) */}
          <aside className="3xl:gap-10 flex flex-col gap-6 lg:sticky lg:top-28 lg:col-span-4">
            <div className="3xl:p-10 4xl:p-12 5xl:p-16 rounded-2xl border border-zinc-200/60 bg-white/40 p-4 shadow-xs backdrop-blur-md sm:p-6 md:p-8">
              <div className="flex flex-col gap-2">
                <span className="3xl:text-sm 4xl:text-base 5xl:text-lg text-xs font-bold tracking-widest text-zinc-500 uppercase">
                  Project Case Study
                </span>
                <h1 className="font-outfit 3xl:text-4xl 4xl:text-5xl 5xl:text-6xl text-2xl font-extrabold tracking-tight text-black sm:text-3xl">
                  {project.title}
                </h1>
              </div>

              {/* Specs Grid */}
              <div className="text-zinc-650 3xl:mt-10 3xl:pt-10 3xl:gap-6 3xl:text-base 4xl:text-lg 5xl:text-xl mt-6 flex flex-col gap-4 border-t border-zinc-200/50 pt-6 text-sm">
                {(Array.isArray(project.customFields) && project.customFields.length > 0
                  ? (project.customFields as unknown as {
                      label: string;
                      value: string;
                      icon?: string;
                    }[])
                  : [
                      { label: "Role", value: "Lead Software Engineer", icon: "user" },
                      { label: "Timeline", value: "Q3 - Q4 2024", icon: "calendar" },
                      { label: "Platform", value: "Web", icon: "layers" },
                    ]
                ).map((field, idx) => {
                  let IconComponent: React.ComponentType<{ className?: string }> = Icons.Layers;

                  if (field.icon) {
                    const pascalName = field.icon
                      .split(/[-_ ]+/)
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                      .join("");
                    const component = (
                      Icons as unknown as Record<
                        string,
                        React.ComponentType<{ className?: string }>
                      >
                    )[pascalName];
                    if (component) {
                      IconComponent = component;
                    }
                  } else {
                    const labelLower = field.label.toLowerCase();
                    if (
                      labelLower.includes("role") ||
                      labelLower.includes("client") ||
                      labelLower.includes("team")
                    ) {
                      IconComponent = Icons.User;
                    } else if (
                      labelLower.includes("time") ||
                      labelLower.includes("date") ||
                      labelLower.includes("duration") ||
                      labelLower.includes("year")
                    ) {
                      IconComponent = Icons.Calendar;
                    }
                  }

                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <IconComponent className="text-zinc-455 3xl:h-5.5 3xl:w-5.5 4xl:h-6.5 4xl:w-6.5 5xl:h-7.5 5xl:w-7.5 h-4.5 w-4.5 shrink-0" />
                      <div className="flex flex-col">
                        <span className="3xl:text-[0.75rem] 4xl:text-[0.85rem] 5xl:text-[0.95rem] mb-1 text-[0.65rem] leading-none font-bold tracking-wider text-zinc-400 uppercase">
                          {field.label}
                        </span>
                        <span className="3xl:text-lg 4xl:text-xl 5xl:text-2xl font-semibold text-black">
                          {field.value}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Technologies pill grid */}
              <div className="3xl:mt-10 3xl:pt-10 mt-6 border-t border-zinc-200/50 pt-6">
                <span className="3xl:text-[0.75rem] 4xl:text-[0.85rem] 5xl:text-[0.95rem] mb-3 block text-[0.65rem] font-bold tracking-wider text-zinc-400 uppercase">
                  Technologies
                </span>
                <div className="3xl:gap-2.5 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="3xl:px-3.5 3xl:py-1 3xl:text-sm 4xl:px-4 4xl:py-1.5 4xl:text-base 5xl:px-5 5xl:py-2 5xl:text-lg rounded-full border border-zinc-200/50 bg-zinc-100/30 px-2.5 py-0.5 text-xs font-semibold text-zinc-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              {(project.githubUrl || project.projectUrl) && (
                <div className="3xl:mt-10 3xl:pt-10 3xl:gap-4 mt-6 flex flex-col gap-2.5 border-t border-zinc-200/50 pt-6">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="3xl:px-6 3xl:py-3.5 3xl:text-base 4xl:px-8 4xl:py-4 4xl:text-lg 5xl:px-10 5xl:py-5 5xl:text-xl flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-black shadow-xs transition-all hover:border-zinc-400 hover:bg-zinc-50"
                    >
                      <span className="flex items-center gap-2">
                        <Github className="3xl:h-5.5 3xl:w-5.5 4xl:h-6.5 4xl:w-6.5 5xl:h-7.5 5xl:w-7.5 h-4.5 w-4.5 text-zinc-500" />
                        <span>Source Code</span>
                      </span>
                      <ChevronRight className="3xl:h-5 3xl:w-5 h-4 w-4 text-zinc-400" />
                    </a>
                  )}

                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="3xl:px-6 3xl:py-3.5 3xl:text-base 4xl:px-8 4xl:py-4 4xl:text-lg 5xl:px-10 5xl:py-5 5xl:text-xl flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-black shadow-xs transition-all hover:border-zinc-400 hover:bg-zinc-50"
                    >
                      <span className="flex items-center gap-2">
                        <ExternalLink className="3xl:h-5.5 3xl:w-5.5 4xl:h-6.5 4xl:w-6.5 5xl:h-7.5 5xl:w-7.5 h-4.5 w-4.5 text-zinc-500" />
                        <span>Live Preview</span>
                      </span>
                      <ChevronRight className="3xl:h-5 3xl:w-5 h-4 w-4 text-zinc-400" />
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="hidden lg:block">
              <BackButton
                href="/projects"
                label="Back to Projects"
                className="w-full justify-center"
              />
            </div>
          </aside>

          {/* Main Case Study Column (8 cols on lg screens) */}
          <section className="lg:col-span-8">
            <div className="3xl:p-10 4xl:p-12 5xl:p-16 rounded-2xl border border-zinc-200/60 bg-white/40 p-4 shadow-xs backdrop-blur-md sm:p-6 md:p-8">
              {/* Spacer to align right column markdown heading with left column heading on desktop */}
              <div className="3xl:h-8 4xl:h-10 5xl:h-12 hidden lg:block lg:h-6" />
              <Markdown content={content} className="3xl:text-lg 4xl:text-xl 5xl:text-2xl" />
            </div>

            <div className="mt-8 block lg:hidden">
              <BackButton
                href="/projects"
                label="Back to Projects"
                className="w-full justify-center py-3 sm:w-auto sm:px-4 sm:py-2.5"
              />
            </div>
          </section>
        </div>
      </main>

      {/* Footer Area */}
      <Footer navGroups={footerNavGroups} socials={footerSocials} />
    </div>
  );
}
