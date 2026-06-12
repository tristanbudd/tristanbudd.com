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

export const blogPosts: BlogPost[] = [
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
];
