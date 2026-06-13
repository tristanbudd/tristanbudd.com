import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const parseDatabaseUrl = (urlStr) => {
  let host = "localhost";
  let port = 3306;
  let user = "dummy";
  let password = "dummy_password";
  let database = "dummy_db";

  if (urlStr) {
    try {
      const parsed = new URL(urlStr);
      host = parsed.hostname || "localhost";
      port = parsed.port ? parseInt(parsed.port, 10) : 3306;
      user = parsed.username ? decodeURIComponent(parsed.username) : "dummy";
      password = parsed.password ? decodeURIComponent(parsed.password) : "dummy_password";
      database = parsed.pathname ? parsed.pathname.replace(/^\//, "") : "dummy_db";
    } catch {
      // If parsing fails, fall back to dummy credentials
    }
  }

  return { host, port, user, password, database };
};

const { host, port, user, password, database } = parseDatabaseUrl(process.env.DATABASE_URL);

const adapter = new PrismaMariaDb({
  host,
  port,
  user,
  password,
  database,
  connectionLimit: 10,
});

const prisma = new PrismaClient({ adapter });

const defaultBlogs = [
  {
    slug: "markdown-test",
    title: "Lorem Ipsum Dolor Sit Amet",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    publishedAt: "2026-06-13",
    category: "Technical Insights",
    readingTime: "3 min read",
    tags: ["Markdown", "Prose", "CSS", "Next.js"],
    content:
      '# Lorem Ipsum Dolor Sit Amet\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. *Sed do eiusmod tempor* incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud **exercitation ullamco** laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in [context link](/) reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n\nFor inline code segments, declaring variables like `const active = true;` works natively.\n\n## Consectetur Adipiscing Elit\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n### Tempor Incididunt Ut Labore\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\n#### Et Dolore Magna Aliqua\n\n##### Ut Enim Ad Minim Veniam\n\n###### Quis Nostrud Exercitation\n\n---\n\n## Ullamco Laboris Nisi Ut Aliquip\n\nLists are structured using standard markdown formatting:\n\n*   **Lorem Ipsum Item One** - Ut enim ad minim veniam.\n*   **Lorem Ipsum Item Two** - Quis nostrud *exercitation* ullamco.\n*   **Lorem Ipsum Item Three** - Link to [GitHub Showcase](https://github.com/tristanbudd).\n\nIf you are detailing sequential items:\n\n1.  **Initialize config**: Run the bootstrap commands.\n2.  **Mount page components**: Set up the React layout.\n3.  **Perform verification**: Verify route structures and build parameters.\n\n---\n\n## Duis Aute Irure Dolor In Reprehenderit\n\nHere is a standard blockquote:\n\n> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.\n>\n> — Cicero\n\nHere are all five premium alert panels:\n\n> [!NOTE]\n> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\n> [!TIP]\n> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\n> [!WARNING]\n> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\n> [!CAUTION]\n> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\n> [!IMPORTANT]\n> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\n---\n\n## Voluptate Velit Esse Cillum Dolore\n\n```typescript\ninterface Config {\n  lorem: string;\n  ipsum: number;\n  active: boolean;\n}\n\nexport function initialize(config: Config) {\n  console.log("Config loaded:", config);\n  return config.active && config.ipsum > 0;\n}\n```\n\n---\n\n## Eu Fugiat Nulla Pariatur\n\n| Lorem Ipsum | Dolor Sit | Amet Consectetur | Adipiscing Elit |\n| :--- | :---: | ---: | :--- |\n| **Sed Do Eiusmod** | Tempor Incididunt | 100ms | Ut Labore |\n| **Et Dolore Magna** | Aliqua Ut Enim | Fast | Minim Veniam |\n| **Quis Nostrud** | Exercitation Ullamco | Isomorphic | Laboris Nisi |\n\n---\n\n## Excepteur Sint Occaecat Cupidatat\n\n![Test Image Place](https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop "Source: Unsplash - Premium Editorial Photography")\n',
  },
];

const defaultProjects = [
  {
    slug: "project-markdown-test",
    title: "Lorem Ipsum Dolor",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    extendedDescription:
      '# Project Study: Lorem Ipsum Dolor\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. *Sed do eiusmod tempor* incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud **exercitation ullamco** laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in [context link](/) reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n\nFor inline code segments, declaring variables like `const active = true;` works natively.\n\n## Key Features\n\nLists are structured using standard markdown formatting:\n\n*   **Responsive Dashboard** - Beautiful glassmorphic UI matching high-end design systems.\n*   **Database Resilience** - Auto-failover and offline message rendering.\n*   **Case Study Visualization** - Supporting rich media assets and nested animations.\n\nIf you are detailing sequential items:\n\n1.  **Initialize config**: Run the bootstrap commands.\n2.  **Mount page components**: Set up the React layout.\n3.  **Perform verification**: Verify route structures and build parameters.\n\n---\n\n## Technical Architecture\n\nHere is a standard blockquote explaining the architecture:\n\n> The architecture decouples data access layers to handle connection pool timeouts gracefully. By utilizing a driver adapter layout, we optimize edge network latency.\n>\n> — Technical Lead\n\nHere are all five premium alert panels:\n\n> [!NOTE]\n> This project was developed using React 19, Next.js 16, and Prisma 7.\n\n> [!TIP]\n> Make sure to configure database pool sizes relative to deployment targets.\n\n> [!WARNING]\n> Destructive actions are restricted during database offline intervals.\n\n> [!CAUTION]\n> Always encrypt OAuth access tokens before storage in the database.\n\n> [!IMPORTANT]\n> The database connection relies on safe runtime parsing fallbacks.\n\n---\n\n## Deployment & Build Script\n\n```typescript\ninterface BuildParams {\n  optimize: boolean;\n  minify: boolean;\n}\n\nexport function runBuild(params: BuildParams) {\n  console.log("Starting production build...", params);\n  return true;\n}\n```\n\n---\n\n## Tech Stack Overview\n\n| Tech | Category | Description | Version |\n| :--- | :---: | ---: | :--- |\n| **Next.js** | Framework | React Server Components | 16.2 |\n| **Prisma** | ORM | Database schema management | 7.8 |\n| **TailwindCSS**| Styling | Utility classes & configuration | 4.0 |\n\n---\n\n## Project Screenshots\n\n![Test Image Place](https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop "Source: Unsplash - Project Development Dashboard")\n',
    tags: ["Lorem", "Ipsum", "Dolor", "Sit"],
    githubUrl: "https://github.com/tristanbudd",
    projectUrl: "https://tristanbudd.com",
    customFields: [
      { label: "Client", value: "Lorem Ipsum", icon: "user" },
      { label: "Role", value: "Lead Dolor Amet", icon: "briefcase" },
      { label: "Timeline", value: "Tempor Incididunt", icon: "calendar" },
      { label: "Platform", value: "Dolor Sit Amet", icon: "layers" },
    ],
    publishedAt: "2026-01-01",
  },
];

async function main() {
  console.log("Seeding database...");

  for (const post of defaultBlogs) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        publishedAt: post.publishedAt,
        category: post.category,
        readingTime: post.readingTime,
        tags: post.tags,
      },
    });
  }

  for (const project of defaultProjects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: {
        slug: project.slug,
        title: project.title,
        description: project.description,
        extendedDescription: project.extendedDescription,
        tags: project.tags,
        githubUrl: project.githubUrl,
        projectUrl: project.projectUrl,
        customFields: project.customFields || [],
        publishedAt: project.publishedAt,
      },
    });
  }

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
