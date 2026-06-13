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
  roleLabel?: string;
  roleValue?: string;
  timelineLabel?: string;
  timelineValue?: string;
  platformLabel?: string;
  platformValue?: string;
  technologiesLabel?: string;
  caseStudyLabel?: string;
  publishedAt?: string;
}

const projectMarkdownContent = `
# Lorem Ipsum Dolor Sit Amet

Lorem ipsum dolor sit amet, consectetur adipiscing elit. *Sed do eiusmod tempor* incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud **exercitation ullamco** laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in [context link](/) reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

For inline code segments, declaring variables like \`const active = true;\` works natively.

## Consectetur Adipiscing Elit

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

### Tempor Incididunt Ut Labore

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

#### Et Dolore Magna Aliqua

##### Ut Enim Ad Minim Veniam

###### Quis Nostrud Exercitation

---

## Ullamco Laboris Nisi Ut Aliquip

Lists are structured using standard markdown formatting:

*   **Lorem Ipsum Item One** - Ut enim ad minim veniam.
*   **Lorem Ipsum Item Two** - Quis nostrud *exercitation* ullamco.
*   **Lorem Ipsum Item Three** - Link to [GitHub Showcase](https://github.com/tristanbudd).

If you are detailing sequential items:

1.  **Initialize config**: Run the bootstrap commands.
2.  **Mount page components**: Set up the React layout.
3.  **Perform verification**: Verify route structures and build parameters.

---

## Duis Aute Irure Dolor In Reprehenderit

Here is a standard blockquote:

> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
>
> — Cicero

Here are all five premium alert panels:

> [!NOTE]
> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

> [!TIP]
> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

> [!WARNING]
> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

> [!CAUTION]
> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

> [!IMPORTANT]
> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

---

## Voluptate Velit Esse Cillum Dolore

\`\`\`typescript
interface Config {
  lorem: string;
  ipsum: number;
  active: boolean;
}

export function initialize(config: Config) {
  console.log("Config loaded:", config);
  return config.active && config.ipsum > 0;
}
\`\`\`

---

## Eu Fugiat Nulla Pariatur

| Lorem Ipsum | Dolor Sit | Amet Consectetur | Adipiscing Elit |
| :--- | :---: | ---: | :--- |
| **Sed Do Eiusmod** | Tempor Incididunt | 100ms | Ut Labore |
| **Et Dolore Magna** | Aliqua Ut Enim | Fast | Minim Veniam |
| **Quis Nostrud** | Exercitation Ullamco | Isomorphic | Laboris Nisi |

---

## Excepteur Sint Occaecat Cupidatat

![Test Image Place](https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop "Source: Unsplash - Premium Editorial Photography")
`;

export const projects: Project[] = [
  {
    slug: "project-markdown-test",
    title: "Lorem Ipsum Dolor",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    extendedDescription: projectMarkdownContent,
    tags: ["Lorem", "Ipsum", "Dolor", "Sit"],
    mockupType: "defect-reporter",
    githubUrl: "https://github.com/tristanbudd",
    projectUrl: "https://tristanbudd.com",
    roleLabel: "Lorem",
    roleValue: "Lead Dolor Amet",
    timelineLabel: "Ipsum",
    timelineValue: "Tempor Incididunt",
    platformLabel: "Ut Labore",
    platformValue: "Dolor Sit Amet",
    technologiesLabel: "Dolore Magna",
    caseStudyLabel: "Lorem Ipsum",
    publishedAt: "2023-11-20",
  },
  {
    slug: "project-one",
    title: "Lorem Ipsum Dolor",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.",
    tags: ["Lorem", "Ipsum", "Dolor", "Sit"],
    mockupType: "defect-reporter",
    githubUrl: "https://github.com/tristanbudd",
    publishedAt: "2023-10-15",
  },
  {
    slug: "project-two",
    title: "Consectetur Adipiscing",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.",
    tags: ["Amet", "Consectetur", "Adipiscing"],
    mockupType: "logistics",
    projectUrl: "https://www.projectlink.com",
    publishedAt: "2023-08-10",
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
    publishedAt: "2023-06-05",
  },
  {
    slug: "project-four",
    title: "Eiusmod Tempor",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
    tags: ["Tempor", "Incididunt", "Eiusmod"],
    mockupType: "study-planner",
    publishedAt: "2023-04-12",
  },
  {
    slug: "project-five",
    title: "Dolore Magna Aliqua",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    tags: ["Dolore", "Magna", "Aliqua"],
    mockupType: "defect-reporter",
    githubUrl: "https://github.com/tristanbudd",
    publishedAt: "2023-02-18",
  },
  {
    slug: "project-six",
    title: "Ut Enim Ad Minim",
    description:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    tags: ["Minim", "Veniam"],
    mockupType: "logistics",
    projectUrl: "https://tristanbudd.com",
    publishedAt: "2022-12-01",
  },
  {
    slug: "project-seven",
    title: "Quis Nostrud",
    description:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    tags: ["Quis", "Nostrud"],
    mockupType: "study-planner",
    githubUrl: "https://github.com/tristanbudd",
    publishedAt: "2022-10-15",
  },
];
