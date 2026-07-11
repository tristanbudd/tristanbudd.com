/**
 * @file blog.ts
 * @description Data structure and interface for blog posts.
 */

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  category: string;
  readingTime: string;
  tags: string[];
  preview?: boolean;
}

export const BLOG_CATEGORIES = [
  "Technical Insights",
  "Tutorials & Guides",
  "DevLog",
  "Software Engineering",
  "Web Development",
  "UI/UX Design",
  "Cloud & DevOps",
  "Career & Productivity",
  "General Tech",
  "System Administration",
  "Cybersecurity",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
