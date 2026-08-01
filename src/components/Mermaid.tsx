"use client";

import { Maximize2, Minus, Plus, RefreshCw } from "lucide-react";
import mermaid from "mermaid";
import { useEffect, useRef, useState } from "react";

// Initialize mermaid diagram
mermaid.initialize({
  startOnLoad: false,
  theme: "neutral",
  securityLevel: "loose",
  themeVariables: {
    fontFamily: "var(--font-sans), system-ui, -apple-system, sans-serif",
    primaryColor: "#ffffff",
    primaryTextColor: "#09090b", // zinc-950
    primaryBorderColor: "#e4e4e7", // zinc-200
    lineColor: "#71717a", // zinc-500
    secondaryColor: "#f4f4f5", // zinc-100
    tertiaryColor: "#fafafa", // zinc-50
    actorBkg: "#ffffff",
    actorBorder: "#e4e4e7",
    actorTextColor: "#09090b",
    signalColor: "#18181b",
    signalTextColor: "#27272a",
    labelBoxBkgColor: "#ffffff",
    labelBoxBorderColor: "#e4e4e7",
    labelTextColor: "#27272a",
    loopBkgColor: "#f4f4f5",
    loopBorderColor: "#e4e4e7",
    noteBkgColor: "#fafafa",
    noteBorderColor: "#e4e4e7",
    noteTextColor: "#27272a",
  },
});

interface MermaidProps {
  chart: string;
  id: string;
}

export default function Mermaid({ chart, id }: MermaidProps) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(true);

  // Pan & Zoom state
  const [scale, setScale] = useState(0.9);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    const renderChart = async () => {
      try {
        setIsRendering(true);
        setError(null);
        const cleanId = `mermaid-${id.replace(/[^a-zA-Z0-9-_]/g, "")}`;

        const { svg: renderedSvg } = await mermaid.render(cleanId, chart);

        if (active) {
          setSvg(renderedSvg);
          setIsRendering(false);
        }
      } catch (err) {
        console.error("Mermaid rendering failed:", err);
        if (active) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          setError(errorMessage);
          setIsRendering(false);
        }
      }
    };

    renderChart();

    return () => {
      active = false;
    };
  }, [chart, id]);

  // Handle native scroll zoom (wheel) to prevent default page scrolling while over diagram
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheelRaw = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = 0.08;
      const direction = e.deltaY < 0 ? 1 : -1;

      setScale((prevScale) => {
        const nextScale = Math.max(0.4, Math.min(4, prevScale + direction * zoomFactor));
        return parseFloat(nextScale.toFixed(2));
      });
    };

    container.addEventListener("wheel", handleWheelRaw, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheelRaw);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Left click only
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Support (Mobile Panning)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setOffset({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Zoom Button Controls
  const handleZoomIn = () => {
    setScale((prev) => Math.min(4, prev + 0.2));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(0.4, prev - 0.2));
  };

  const handleReset = () => {
    setScale(0.9);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div
      data-lenis-prevent
      className="relative my-6 w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50/20 shadow-xs select-none"
    >
      {/* Pan & Zoom Container */}
      <div
        ref={containerRef}
        className="relative flex h-87.5 cursor-grab items-center justify-center overflow-hidden active:cursor-grabbing md:h-125"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {isRendering && (
          <div className="text-zinc-450 flex flex-col items-center justify-center gap-3 py-12">
            <RefreshCw className="h-6 w-6 animate-spin text-zinc-400" />
            <span className="text-xs font-medium tracking-wide">Rendering vector chart...</span>
          </div>
        )}

        {error && (
          <div className="mx-auto max-w-lg rounded-lg border border-rose-200 bg-rose-50/20 p-4 text-xs text-rose-800 select-text">
            <p className="mb-1.5 font-bold">Diagram render failed:</p>
            <p className="mb-3 overflow-x-auto rounded border border-rose-100/50 bg-white p-2.5 font-mono leading-relaxed whitespace-pre-wrap">
              {error}
            </p>
          </div>
        )}

        {!isRendering && !error && svg && (
          <div
            className="mermaid-svg-container pointer-events-none w-full max-w-xl select-none md:max-w-3xl lg:max-w-4xl [&_foreignObject]:overflow-visible [&>svg]:h-auto [&>svg]:w-full"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
              transformOrigin: "center center",
              transition: isDragging ? "none" : "transform 0.15s ease-out",
            }}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        )}
      </div>

      {/* Floating Controls overlay */}
      {!isRendering && !error && svg && (
        <div className="absolute right-4 bottom-4 flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white/95 p-1 shadow-sm backdrop-blur-xs select-none">
          <button
            onClick={handleZoomOut}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
            title="Zoom Out"
          >
            <Minus className="h-4 w-4" />
          </button>

          <span className="min-w-12 text-center font-mono text-[10px] font-bold text-zinc-500">
            {Math.round(scale * 100)}%
          </span>

          <button
            onClick={handleZoomIn}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
            title="Zoom In"
          >
            <Plus className="h-4 w-4" />
          </button>

          <div className="h-4 w-px bg-zinc-200" />

          <button
            onClick={handleReset}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
            title="Reset View"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
