"use client";

import { ReactLenis } from "lenis/react";
import ConsoleGame from "@/components/ConsoleGame";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root>
      <ConsoleGame />
      {children}
    </ReactLenis>
  );
}
