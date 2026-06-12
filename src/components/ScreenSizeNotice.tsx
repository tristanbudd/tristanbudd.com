/**
 * @file ScreenSizeNotice.tsx
 * @description Screen size (too small) notice component.
 */

import { Maximize2 } from "lucide-react";

export default function ScreenSizeNotice() {
  return (
    <div
      id="screen-size-notice"
      className="font-outfit border-secondary/10 bg-background/98 text-foreground fixed inset-0 z-9999 h-screen w-screen flex-col items-center justify-center overflow-hidden border px-6 py-12 text-center backdrop-blur-xl select-none"
      role="alert"
      aria-live="assertive"
    >
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.01)_0%,transparent_70%)]" />

      {/* Main warning card */}
      <div className="relative z-10 flex max-w-xs flex-col items-center gap-4">
        {/* Minimalist icon */}
        <div className="mb-2 text-black">
          <Maximize2 className="h-6 w-6 stroke-[1.5]" />
        </div>

        {/* Text descriptions */}
        <div className="space-y-2">
          <h2 className="font-outfit text-foreground text-lg font-bold tracking-tight">
            Screen Too Small
          </h2>
          <p className="font-outfit text-secondary text-[14px] leading-relaxed font-medium">
            This portfolio is optimized for viewports of 320px and wider. Please enlarge your
            browser window or rotate your device to landscape.
          </p>
        </div>
      </div>
    </div>
  );
}
