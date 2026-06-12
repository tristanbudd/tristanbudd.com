/**
 * @file projects.ts
 * @description Project data structure and project items.
 */

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
