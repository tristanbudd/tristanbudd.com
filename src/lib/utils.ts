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
