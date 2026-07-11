/**
 * @file projects.ts
 * @description Data structure and interface for portfolio projects.
 */

export interface CustomField {
  label: string;
  value: string;
  icon?: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  extendedDescription: string;
  tags: string[];
  projectUrl?: string | null;
  githubUrl?: string | null;
  customFields?: CustomField[];
  publishedAt?: string | null;
  featured?: boolean;
  preview?: boolean;
}
