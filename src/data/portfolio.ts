/**
 * @file portfolio.ts
 * @description Shared portfolio data repository including experience, education, certifications, and project lists.
 */

import { NavItem } from "@/components/Header";

export interface Project {
  slug: string;
  title: string;
  description: string;
  extendedDescription?: string;
  tags: string[];
  projectUrl?: string;
  githubUrl?: string;
  mockupType: "defect-reporter" | "logistics" | "study-planner";
}

export interface CertificationItem {
  title: string;
  issuer: string;
  date: string;
  skills: string[];
  logoSlug: string;
  credentialUrl?: string;
}

export interface TechItem {
  name: string;
  slug: string;
}

export interface ExperienceItem {
  role: string;
  organization: string;
  location?: string;
  startDate: Date;
  endDate: Date;
  dateString: string;
  descriptionPoints: string[];
  logoPath: string;
  url?: string;
}

export interface EducationItem {
  institution: string;
  location?: string;
  degree: string;
  date: string;
  details?: string;
  logoPath: string;
  courseUrl?: string;
  status?: "in_progress" | "completed";
}

export const navItems: NavItem[] = [
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

export const languages: TechItem[] = [
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

export const tools: TechItem[] = [
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

export const certificates: CertificationItem[] = [
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

export const educationList: EducationItem[] = [
  {
    institution: "University of Portsmouth",
    location: "School of Computing",
    degree: "Honours Degree in Software Engineering",
    date: "September 2024 - July 2028",
    logoPath: "/uop.svg",
    courseUrl: "https://www.port.ac.uk/study/courses/undergraduate/bsc-hons-software-engineering",
    status: "in_progress",
  },
  {
    institution: "Fareham College",
    location: "Bishopsfield Campus",
    degree: "T-Level In Digital Production, Design & Development",
    date: "September 2022 - July 2024",
    details: "Overall Grade - Distinction",
    logoPath: "/fareham.svg",
    courseUrl:
      "https://qualifications.pearson.com/en/qualifications/t-levels/digital-production-design-and-development.html",
    status: "completed",
  },
];

export const workExperience: ExperienceItem[] = [
  {
    role: "Junior Software Engineer",
    organization: "RadWeb LTD",
    location: "Lakeside North Harbour, Portsmouth",
    startDate: new Date("2026-06-15"),
    endDate: new Date(),
    dateString: "15th June 2026 - Present",
    logoPath: "/radweb.svg",
    url: "https://radweb.com/",
    descriptionPoints: [],
  },
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

export const volunteering: ExperienceItem[] = [
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

export const projects: Project[] = [
  {
    slug: "project-one",
    title: "Lorem Ipsum Dolor",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.",
    tags: ["Lorem", "Ipsum", "Dolor", "Sit"],
    mockupType: "defect-reporter",
    githubUrl: "https://github.com/tristanbudd",
  },
  {
    slug: "project-two",
    title: "Consectetur Adipiscing",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.",
    tags: ["Amet", "Consectetur", "Adipiscing"],
    mockupType: "logistics",
    projectUrl: "https://www.projectlink.com",
  },
  {
    slug: "project-three",
    title: "Eiusmod Tempor",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
    tags: ["Tempor", "Incididunt", "Eiusmod"],
    mockupType: "study-planner",
    githubUrl: "https://github.com/tristanbudd",
    projectUrl: "https://www.projectlink.com",
  },
  {
    slug: "project-four",
    title: "Eiusmod Tempor",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
    tags: ["Tempor", "Incididunt", "Eiusmod"],
    mockupType: "study-planner",
  },
];
