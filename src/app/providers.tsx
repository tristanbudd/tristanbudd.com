"use client";

import { ReactLenis } from "lenis/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ReactLenis root>{children}</ReactLenis>;
}
