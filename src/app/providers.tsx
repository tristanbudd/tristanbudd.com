"use client";

import { ReactLenis } from "lenis/react";
import ConsoleGame from "@/components/ConsoleGame";
import { TransitionProvider } from "@/context/TransitionContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root>
      <TransitionProvider>
        <ConsoleGame />
        {children}
      </TransitionProvider>
    </ReactLenis>
  );
}
