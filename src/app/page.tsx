/**
 * @file page.tsx
 * @description Main entry page for the portfolio site. Implements hero, header, stats, and tech stack layout.
 */

import Certifications from "../components/Certifications";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Projects from "../components/Projects";
import StatsPanel from "../components/StatsPanel";
import TechStack from "../components/TechStack";
import Timeline from "../components/Timeline";
import {
  certificates,
  educationList,
  footerNavGroups,
  footerSocials,
  languages,
  navItems,
  projects,
  tools,
  volunteering,
  workExperience,
} from "../data/portfolio";
import { getYearsOfExperience, formatDuration } from "../lib/utils";

/**
 * Fetches the total all-time contribution count for a GitHub user. Falls back to 0 on any error.
 */
async function getGitHubContributions(username: string): Promise<number> {
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return 0;
    const data = (await res.json()) as { total?: Record<string, number> };
    if (!data.total) return 0;
    return Object.values(data.total).reduce((sum, n) => sum + n, 0);
  } catch {
    return 0;
  }
}

export default async function Home() {
  // Derived stats
  const yearsOfExperience = getYearsOfExperience();
  const techStackCount = languages.length + tools.length;
  const githubContributions = await getGitHubContributions("tristanbudd");

  const stats = [
    { value: yearsOfExperience, label: "Years of Experience", approximate: true },
    { value: projects.length, label: "Projects Completed", approximate: true },
    { value: githubContributions, label: "GitHub Contributions", approximate: true },
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
        <Projects projects={projects} title="Featured Projects" subtitle="My Work" isPreview />

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
