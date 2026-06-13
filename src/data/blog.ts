/**
 * @file blog.ts
 * @description Data structure and list of blog posts.
 */

import { calculateReadingTime } from "../lib/utils";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  category: string;
  readingTime: string;
  tags: string[];
}

// TODO: Swap sample data with real data

const loremParagraph =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

// Generate realistic article lengths for calculated reading times
const post1Content = Array(18).fill(loremParagraph).join("\n\n");
const post2Content = Array(12).fill(loremParagraph).join("\n\n");
const post3Content = Array(15).fill(loremParagraph).join("\n\n");

const markdownTestContent = `
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

export const blogPosts: BlogPost[] = [
  {
    slug: "markdown-test",
    title: "Lorem Ipsum Dolor Sit Amet",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    publishedAt: "June 13, 2026",
    category: "Technical Insights",
    readingTime: calculateReadingTime(markdownTestContent),
    tags: ["Markdown", "Prose", "CSS", "Next.js"],
    content: markdownTestContent,
  },
  {
    slug: "article-1",
    title: "Lorem Ipsum Dolor Sit Amet",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.",
    publishedAt: "May 28, 2026",
    category: "Category 1",
    readingTime: calculateReadingTime(post1Content),
    tags: ["Tag 1", "Tag 2", "Tag 3", "Tag 4"],
    content: post1Content,
  },
  {
    slug: "article-2",
    title: "Consectetur Adipiscing Elit",
    excerpt:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.",
    publishedAt: "June 10, 2026",
    category: "Category 2",
    readingTime: calculateReadingTime(post2Content),
    tags: ["Tag 1", "Tag 2", "Tag 3", "Tag 4"],
    content: post2Content,
  },
  {
    slug: "article-3",
    title: "Eiusmod Tempor Incididunt",
    excerpt:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
    publishedAt: "May 15, 2026",
    category: "Category 3",
    readingTime: calculateReadingTime(post3Content),
    tags: ["Tag 1", "Tag 2", "Tag 3", "Tag 4"],
    content: post3Content,
  },
  {
    slug: "article-4",
    title: "Dolore Magna Aliqua",
    excerpt:
      "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.",
    publishedAt: "April 20, 2026",
    category: "Category 4",
    readingTime: calculateReadingTime(post1Content),
    tags: ["Tag A", "Tag B"],
    content: post1Content,
  },
  {
    slug: "article-5",
    title: "Ut Enim Ad Minim Veniam",
    excerpt:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    publishedAt: "April 10, 2026",
    category: "Category 5",
    readingTime: calculateReadingTime(post2Content),
    tags: ["Tag X", "Tag Y"],
    content: post2Content,
  },
  {
    slug: "article-6",
    title: "Quis Nostrud Exercitation",
    excerpt:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.",
    publishedAt: "March 15, 2026",
    category: "Category 6",
    readingTime: calculateReadingTime(post3Content),
    tags: ["Tag Z", "Tag W"],
    content: post3Content,
  },
  {
    slug: "article-7",
    title: "Ullamco Laboris Nisi",
    excerpt:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    publishedAt: "March 01, 2026",
    category: "Category 7",
    readingTime: calculateReadingTime(post1Content),
    tags: ["Tag 1", "Tag 2"],
    content: post1Content,
  },
];
