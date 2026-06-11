/**
 * @file page.tsx
 * @description Main entry page for the portfolio site. Implements hero, header, stats, and tech stack layout.
 */

import Certifications from "../components/Certifications";
import Education from "../components/Education";
import Experience from "../components/Experience";
import Header from "../components/Header";
import Hero from "../components/Hero";
import StatsPanel from "../components/StatsPanel";
import TechStack from "../components/TechStack";
import { getYearsOfExperience } from "../lib/utils";

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

const PROJECTS_COMPLETED = 0;

export default async function Home() {
  const navItems = [
    {
      label: "Placeholder 1",
      href: "#",
      dropdownItems: [
        { label: "Sub Item A", href: "#" },
        { label: "Sub Item B", href: "#" },
      ],
    },
    { label: "Placeholder 2", href: "#" },
    {
      label: "Placeholder 3",
      href: "#",
      dropdownItems: [
        { label: "Sub Item C", href: "#" },
        { label: "Sub Item D", href: "#" },
      ],
    },
    { label: "Placeholder 4", href: "#" },
  ];

  const languages = [
    { name: "PHP", slug: "php" },
    { name: "TypeScript", slug: "typescript" },
    { name: "JavaScript", slug: "javascript" },
    { name: "Python", slug: "python" },
    { name: "SQL", slug: "sqlite" },
    { name: "HTML", slug: "html5" },
    { name: "CSS", slug: "css" },
    { name: "Dart", slug: "dart" },
    { name: "R", slug: "r" },
  ];

  const tools = [
    { name: "Laravel", slug: "laravel" },
    { name: "React", slug: "react" },
    { name: "Next.js", slug: "nextdotjs" },
    { name: "Node.js", slug: "nodedotjs" },
    { name: "Tailwind CSS", slug: "tailwindcss" },
    { name: "Docker", slug: "docker" },
    { name: "Git", slug: "git" },
    { name: "PostgreSQL", slug: "postgresql" },
    { name: "MySQL", slug: "mysql" },
    { name: "Linux", slug: "linux" },
    { name: "Figma", slug: "figma" },
  ];

  const certificates = [
    {
      title: "DataCamp AI Engineer",
      issuer: "DataCamp",
      date: "September 2025",
      skills: [
        "AI Models",
        "ML Pipelines",
        "Python",
        "Model Deployment",
        "Feature Engineering",
        "Deep Learning",
      ],
      logoSlug: "datacamp",
      credentialUrl: "https://www.datacamp.com/certificate/AIEDA0011387218901",
    },
    {
      title: "GitHub Foundations",
      issuer: "GitHub",
      date: "July 2025",
      skills: [
        "Git & GitHub",
        "Version Control",
        "Collaborative Coding",
        "GitHub Actions",
        "Pull Requests",
        "CI/CD Foundations",
      ],
      logoSlug: "github",
      credentialUrl:
        "https://learn.microsoft.com/en-us/users/tristanbudd/credentials/314f5807b4d2c1d8",
    },
    {
      title: "Google UX Design Professional Certificate",
      issuer: "Google",
      date: "September 2024",
      skills: [
        "Figma",
        "Wireframing",
        "Prototyping",
        "User Research",
        "Usability Testing",
        "User-Centered Design",
        "Information Architecture",
      ],
      logoSlug: "google",
      credentialUrl: "https://www.credly.com/badges/4af22da5-a24c-4b69-b619-6bc880e33b84/",
    },
  ];

  const educationList = [
    {
      institution: "University of Portsmouth - School of Computing",
      degree: "Honours Degree in Software Engineering",
      date: "September 2024 - July 2028",
      logoPath: "/uop.svg",
      courseUrl: "https://www.port.ac.uk/study/courses/undergraduate/bsc-hons-software-engineering",
      status: "in_progress" as const,
    },
    {
      institution: "Fareham College - Bishopsfield Campus",
      degree: "T-Level In Digital Production, Design & Development",
      date: "September 2022 - July 2024",
      details: "Overall Grade - Distinction",
      logoPath: "/fareham.svg",
      courseUrl:
        "https://qualifications.pearson.com/en/qualifications/t-levels/digital-production-design-and-development.html",
      status: "completed" as const,
    },
  ];

  const workExperience = [
    {
      role: "T-Level Industrial Placement",
      organization: "Hampshire & Isle Of Wight Constabulary",
      location: "Hamble Lane, Hamble",
      startDate: new Date("2022-11-20"),
      endDate: new Date("2024-06-19"),
      dateString: "20th November 2022 - 19th June 2024",
      logoPath: "/hiowc.svg",
      url: "https://www.hampshire.police.uk",
      descriptionPoints: [
        "Delivered digital solutions to modernise processes and improve usability for officers.",
        "Developed a mobile vehicle defect reporting system, replacing a complex, outdated workflow.",
        "Managed full project lifecycle: requirements, design, development, testing, and user evaluation.",
        "Conducted security, reliability, and accessibility testing to meet legal and regulatory standards.",
        "Presented solutions and trained new placement students, explaining technical concepts clearly.",
      ],
    },
  ];

  const volunteering = [
    {
      role: "Volunteer Technician & Developer",
      organization: "Repair Café Gosport",
      location: "Various Locations, Gosport",
      startDate: new Date("2025-09-01"),
      endDate: new Date("2025-11-30"),
      dateString: "September 2025 - November 2025",
      logoPath: "/repaircafe.svg",
      url: "https://www.repaircafegosport.co.uk",
      descriptionPoints: [
        "Volunteered to repair electronics, supporting sustainability and reducing e-waste.",
        "Developed automation tools to streamline event logistics and cut administrative work.",
        "Collaborated with organisers and stakeholders to enhance overall operations.",
      ],
    },
  ];

  // Derived stats
  const yearsOfExperience = getYearsOfExperience();
  const techStackCount = languages.length + tools.length;
  const githubContributions = await getGitHubContributions("tristanbudd");

  const stats = [
    { value: yearsOfExperience, label: "Years of Experience", approximate: true },
    { value: PROJECTS_COMPLETED, label: "Projects Completed", approximate: true },
    { value: githubContributions, label: "GitHub Contributions", approximate: true },
    { value: techStackCount, label: "Tech Stack", approximate: false },
  ];

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Header navItems={navItems} ctaText="Placeholder CTA" ctaHref="#" />

      {/* Main Content Area */}
      <main
        role="main"
        className="3xl:max-w-440 4xl:max-w-560 5xl:max-w-720 mx-auto flex w-full flex-col px-4 pt-0 pb-8 font-sans transition-all duration-500 ease-in-out sm:max-w-screen-sm md:max-w-3xl md:pb-16 lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl"
      >
        {/* Hero */}
        <Hero
          title="Tristan Budd"
          subtitle="An aspiring software developer & engineer with a strong foundation in building robust digital solutions. Experienced in delivering high-quality projects both independently and collaboratively, always seeking innovative challenges."
          ctaText="Placeholder CTA"
          ctaHref="#"
        />

        {/* Stats Panel */}
        <StatsPanel stats={stats} title="Track Record" subtitle="By the numbers" />

        {/* Tech Stack */}
        <TechStack title="Tech Stack" subtitle="Built with" languages={languages} tools={tools} />

        {/* Work Experience */}
        <Experience
          items={workExperience}
          title="Work Experience"
          subtitle="Professional Journey"
        />

        {/* Education */}
        <Education educationList={educationList} title="Education" subtitle="Academic Journey" />

        {/* Volunteering */}
        <Experience items={volunteering} title="Volunteering" subtitle="Giving Back" />

        {/* Certifications */}
        <Certifications
          certificates={certificates}
          title="Certifications & Learning"
          subtitle="Qualifications"
        />
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
