"use client";

/**
 * @file page.tsx
 * @description Catch-all route page that forwards all unmatched requests to the consolidated error page with a 404 state.
 */

import ErrorPage from "../error";

export default function CatchAllPage() {
  return <ErrorPage error={new Error("Page not found")} reset={() => {}} />;
}
