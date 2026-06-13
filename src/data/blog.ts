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
}
