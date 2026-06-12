/**
 * @file utils.ts
 * @description General utility library containing styling helpers and mathematical formatting tools.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names dynamically using clsx and resolves Tailwind CSS conflicts.
 *
 * @param inputs - List of class values to merge.
 * @returns The merged, conflict-resolved CSS class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number into a compact string representation with suffixes (k, M, B, etc.),
 * dynamically removing trailing decimals if they are not needed (e.g., 1k instead of 1.0k).
 *
 * @param num - The raw numeric value to format.
 * @returns An object containing the formatted value string and its associated suffix.
 */
export function formatCompactNumber(num: number): { value: string; suffix: string } {
  const absNum = Math.abs(num);
  if (absNum >= 1e9) {
    const formatted = (num / 1e9).toFixed(1).replace(/\.0$/, "");
    return { value: formatted, suffix: "B" };
  }
  if (absNum >= 1e6) {
    const formatted = (num / 1e6).toFixed(1).replace(/\.0$/, "");
    return { value: formatted, suffix: "M" };
  }
  if (absNum >= 1e3) {
    const formatted = (num / 1e3).toFixed(1).replace(/\.0$/, "");
    return { value: formatted, suffix: "k" };
  }

  // Handle standard decimal numbers below 1000
  const formatted = num.toFixed(1).replace(/\.0$/, "");
  return { value: formatted, suffix: "" };
}

/**
 * Returns the number of full years elapsed since September 1st 2020,
 * (experience is only counted once a full year has passed.
 *
 * In 2020, I first began learning how to code in secondary school via Computer Science
 * classes and extracurricular activities.
 *
 * @returns Whole number of years of experience.
 */
export function getYearsOfExperience(): number {
  const start = new Date(2020, 8, 1); // Month is 0-indexed: 8 = September
  const now = new Date();
  const ms = now.getTime() - start.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24 * 365.25));
}

/**
 * Calculates the duration between two dates and formats it as a string
 * (e.g. "1 year, 7 months" or "3 months"), rounding to the closest month.
 *
 * @param start - The start date.
 * @param end - The end date.
 * @returns Formatted duration string.
 */
export function formatDuration(start: Date, end: Date): string {
  const now = new Date();

  // Start date is still in the future
  if (start > now) return "Not Started";

  // Use the lesser of end and now so "present" roles use today's date
  const effectiveEnd = end > now ? now : end;

  const totalYearsDiff = effectiveEnd.getFullYear() - start.getFullYear();
  const totalMonthsDiff = effectiveEnd.getMonth() - start.getMonth();
  const dayDiff = effectiveEnd.getDate() - start.getDate();

  // Calculate fractional months using average length of a month (30.4375 days)
  const fractionalMonths = totalYearsDiff * 12 + totalMonthsDiff + dayDiff / 30.4375;
  const roundedMonths = Math.round(fractionalMonths);

  // Less than 1 month elapsed
  if (roundedMonths < 1) return "Just Started";

  const years = Math.floor(roundedMonths / 12);
  const months = roundedMonths % 12;

  const parts: string[] = [];
  if (years > 0) {
    parts.push(`${years} year${years > 1 ? "s" : ""}`);
  }
  if (months > 0) {
    parts.push(`${months} month${months > 1 ? "s" : ""}`);
  }

  if (parts.length === 0) {
    return "Just Started";
  }

  return parts.join(", ");
}

/**
 * Calculates the estimated reading time of a given text content.
 * Assuming average reading speed of 200 words per minute.
 *
 * @param content - The raw text content of the article.
 * @returns Estimated reading time string (e.g. "5 min read").
 */
export function calculateReadingTime(content: string): string {
  if (!content) return "1 min read";
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

/**
 * Parses a date string in the format "Month DD, YYYY" into month, day, and year.
 *
 * @param dateStr - The raw date string.
 * @returns An object containing the capitalized short month name, day, and year.
 */
export function parseDate(dateStr: string): { month: string; day: string; year: string } {
  if (!dateStr) {
    return { month: "N/A", day: "—", year: "—" };
  }
  const parts = dateStr.replace(",", "").split(" ");
  if (parts.length === 3) {
    const month = parts[0].substring(0, 3).toUpperCase();
    const day = parts[1];
    const year = parts[2];
    return { month, day, year };
  }
  return { month: "N/A", day: "—", year: "—" };
}
