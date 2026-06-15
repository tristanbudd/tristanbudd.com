"use client";

/**
 * @file gtm.ts
 * @description Google Tag Manager (GTM) tracking helpers for the website
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Pushes a generic event to Google Tag Manager's dataLayer
 */
export function sendGTMEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    timestamp: new Date().toISOString(),
    ...data,
  });
}

/**
 * Specific tracking helper for navigation / header link clicks
 */
export function trackNavigation(label: string, destination: string) {
  sendGTMEvent("navigation_click", {
    link_label: label,
    link_url: destination,
  });
}

/**
 * Specific tracking helper for CTA / Action buttons
 */
export function trackCTA(text: string, href?: string) {
  sendGTMEvent("cta_click", {
    cta_text: text,
    cta_href: href || "none",
  });
}

/**
 * Specific tracking helper for Contact Form events
 */
export function trackContactForm(
  action: "start" | "submit_success" | "submit_error",
  details?: Record<string, unknown>
) {
  sendGTMEvent("contact_form", {
    form_action: action,
    ...details,
  });
}

/**
 * Specific tracking helper for Console Game events
 */
export function trackConsoleGame(
  action: "discover" | "start" | "guess" | "win" | "lose",
  details?: Record<string, unknown>
) {
  sendGTMEvent("console_game", {
    game_action: action,
    ...details,
  });
}

/**
 * Specific tracking helper for Project detail/link interactions
 */
export function trackProjectClick(title: string, action: "demo" | "repository" | "view") {
  sendGTMEvent("project_click", {
    project_title: title,
    click_action: action,
  });
}
