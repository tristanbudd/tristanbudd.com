import { Smartphone } from "lucide-react";

export default function ScreenSizeNotice() {
  return (
    <div
      id="screen-size-notice"
      className="fixed inset-0 z-9999 flex h-full w-full flex-col items-center justify-center overflow-hidden border border-zinc-200 bg-white/98 px-6 py-12 text-center text-zinc-900 backdrop-blur-xl select-none"
      role="alert"
      aria-live="assertive"
    >
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_0%,transparent_70%)]" />

      {/* Main warning card */}
      <div className="relative z-10 flex max-w-xs flex-col items-center gap-6">
        {/* Animated phone icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-800 shadow-xs">
          <Smartphone className="h-8 w-8 animate-pulse text-black" />
        </div>

        {/* Text descriptions */}
        <div className="space-y-2">
          <h1 className="font-syne text-lg font-bold tracking-tight text-black uppercase">
            Screen Too Small
          </h1>
          <p className="text-zinc-650 font-outfit text-[14px] leading-relaxed font-medium">
            This portfolio is optimized for viewports of 320px and wider. Please enlarge your
            browser window or rotate your device to landscape.
          </p>
        </div>
      </div>
    </div>
  );
}
