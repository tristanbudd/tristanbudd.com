"use client";

import { useEffect, useState } from "react";
import BlogSection from "./BlogSection";
import Certifications from "./Certifications";
import Contact from "./Contact";
import Footer from "./Footer";
import Header from "./Header";
import Hero from "./Hero";
import ProjectSection from "./ProjectSection";
import StatsPanel from "./StatsPanel";
import TechStack from "./TechStack";
import Timeline from "./Timeline";
import { type BlogPost } from "../data/blog";
import {
  certificates,
  educationList,
  footerNavGroups,
  footerSocials,
  languages,
  navItems,
  tools,
  volunteering,
  workExperience,
} from "../data/portfolio";
import { type Project } from "../data/projects";
import { formatDuration, getYearsOfExperience } from "../lib/utils";

export default function HomeClient() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [githubContributions, setGithubContributions] = useState<number | null>(null);

  const [blogsLoading, setBlogsLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [githubLoading, setGithubLoading] = useState(true);

  const [blogsError, setBlogsError] = useState(false);
  const [projectsError, setProjectsError] = useState(false);
  const [githubError, setGithubError] = useState(false);

  useEffect(() => {
    // Fetch blogs
    fetch("/api/blog")
      .then((res) => {
        if (!res.ok) {
          setBlogsError(true);
          setBlogsLoading(false);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data === null) return;
        const formatted = Array.isArray(data)
          ? (data as BlogPost[]).map((b) => ({
              ...b,
              tags: Array.isArray(b.tags) ? b.tags : [],
            }))
          : [];
        setBlogs(formatted);
        setBlogsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
        setBlogsError(true);
        setBlogsLoading(false);
      });

    // Fetch projects
    fetch("/api/projects")
      .then((res) => {
        if (!res.ok) {
          setProjectsError(true);
          setProjectsLoading(false);
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
        setProjectsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        setProjectsError(true);
        setProjectsLoading(false);
      });

    // Fetch GitHub contributions
    fetch("/api/github?username=tristanbudd")
      .then((res) => {
        if (!res.ok) {
          setGithubError(true);
          setGithubLoading(false);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data === null) return;
        setGithubContributions(data.count);
        setGithubLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching GitHub contributions:", err);
        setGithubError(true);
        setGithubLoading(false);
      });
  }, []);

  const yearsOfExperience = getYearsOfExperience();
  const techStackCount = languages.length + tools.length;

  const stats = [
    { value: yearsOfExperience, label: "Years of Experience", approximate: true },
    {
      value: projectsLoading ? null : projects.length,
      label: "Projects Completed",
      approximate: true,
      isError: projectsError,
    },
    {
      value: githubLoading ? null : githubContributions,
      label: "GitHub Contributions",
      approximate: true,
      isError: githubError,
    },
    { value: techStackCount, label: "Tech Stack", approximate: false },
  ];

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Header navItems={navItems} ctaText="Get in touch?" ctaHref="/#contact" />

      {/* Main Content Area */}
      <main
        role="main"
        className="3xl:max-w-440 4xl:max-w-560 5xl:max-w-720 mx-auto flex w-full flex-col px-4 pt-0 pb-8 font-sans transition-all duration-500 ease-in-out sm:max-w-screen-sm md:max-w-3xl md:pb-16 lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl"
      >
        {/* Hero */}
        <Hero
          title="Tristan Budd"
          subtitle="An aspiring software developer & engineer with a strong foundation in building robust digital solutions. Experienced in delivering high-quality projects both independently and collaboratively, always seeking innovative challenges."
          ctaText="Get in touch?"
          ctaHref="#contact"
        />

        {/* Stats Panel */}
        <StatsPanel stats={stats} title="Track Record" subtitle="By the numbers" />

        {/* Tech Stack */}
        <TechStack title="Tech Stack" subtitle="Built with" languages={languages} tools={tools} />

        {/* Featured Projects Preview Showcase */}
        <ProjectSection
          projects={projects}
          title="Featured Projects"
          subtitle="My Work"
          isPreview
          isDbOffline={projectsError}
          isLoading={projectsLoading}
        />

        {/* Latest Articles Blog Preview Showcase */}
        <BlogSection posts={blogs} isPreview isDbOffline={blogsError} isLoading={blogsLoading} />

        {/* Work Experience */}
        <Timeline
          id="experience"
          title="Work Experience"
          subtitle="Professional Journey"
          items={workExperience.map((item) => ({
            title: item.role,
            subtitle: item.organization,
            location: item.location,
            dateString: item.dateString,
            badgeText: formatDuration(item.startDate, item.endDate),
            logoPath: item.logoPath,
            url: item.url,
            points: item.descriptionPoints,
          }))}
        />

        {/* Education */}
        <Timeline
          id="education"
          title="Education"
          subtitle="Academic Journey"
          items={educationList.map((item) => ({
            title: item.degree,
            subtitle: item.institution,
            location: item.location,
            dateString: item.date,
            badgeText: item.status === "in_progress" ? "Ongoing" : item.details,
            logoPath: item.logoPath,
            url: item.courseUrl,
          }))}
        />

        {/* Volunteering */}
        <Timeline
          id="volunteering"
          title="Volunteering"
          subtitle="Giving Back"
          items={volunteering.map((item) => ({
            title: item.role,
            subtitle: item.organization,
            location: item.location,
            dateString: item.dateString,
            badgeText: formatDuration(item.startDate, item.endDate),
            logoPath: item.logoPath,
            url: item.url,
            points: item.descriptionPoints,
          }))}
        />

        {/* Certifications */}
        <Certifications
          certificates={certificates}
          title="Certifications & Learning"
          subtitle="Qualifications"
        />

        {/* Contact */}
        <Contact
          linkedInUrl="https://www.linkedin.com/in/tristanbudd"
          linkedInHandle="tristanbudd"
        />
      </main>

      {/* Footer Area */}
      <Footer navGroups={footerNavGroups} socials={footerSocials} />
    </div>
  );
}
