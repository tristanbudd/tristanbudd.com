/**
 * @file page.tsx
 * @description Main entry page for the portfolio site. Implements hero, header, and stats layout.
 */

import Header from "../components/Header";
import Hero from "../components/Hero";
import StatsPanel from "../components/StatsPanel";

export default function Home() {
  const navItems = [
    {
      label: "Placeholder 1",
      href: "#",
      dropdownItems: [
        { label: "Sub Item A", href: "#" },
        { label: "Sub Item B", href: "#" },
      ],
    },
    {
      label: "Placeholder 2",
      href: "#",
    },
    {
      label: "Placeholder 3",
      href: "#",
      dropdownItems: [
        { label: "Sub Item C", href: "#" },
        { label: "Sub Item D", href: "#" },
      ],
    },
    {
      label: "Placeholder 4",
      href: "#",
    },
  ];

  // TODO: Replace with real values.
  const stats = [
    { value: 8, label: "Years of Experience", approximate: true },
    { value: 42, label: "Projects Completed", approximate: true },
    { value: 2400, label: "GitHub Contributions", approximate: true },
    { value: 15, label: "Tech Stack", approximate: true },
  ];

  // TODO: Add proceadural / deferred section rendering.

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Header navItems={navItems} ctaText="Placeholder CTA" ctaHref="#" />

      {/* Main Content Area */}
      <main
        role="main"
        className="3xl:max-w-440 4xl:max-w-560 5xl:max-w-720 mx-auto flex w-full flex-col gap-10 px-4 pt-0 pb-8 font-sans transition-all duration-500 ease-in-out sm:max-w-screen-sm md:max-w-3xl md:pb-16 lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl"
      >
        {/* Hero */}
        <Hero
          title="Tristan Budd"
          subtitle="An aspiring software developer & engineer with a strong foundation in building robust digital solutions. Experienced in delivering high-quality projects both independently and collaboratively, always seeking innovative challenges."
          ctaText="Placeholder CTA"
          ctaHref="#"
        />

        {/* Stats Panel */}
        <StatsPanel stats={stats} title="Track Record" subtitle="By the numbers" />

        {/* 3-Column Grid */}
        <section
          aria-label="Feature Grid Section"
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          <div className="flex min-h-[150px] items-center justify-center border-2 border-dashed border-zinc-400 bg-zinc-100/50 p-8 text-center">
            <span className="text-secondary text-sm font-medium">Grid Item 1</span>
          </div>
          <div className="flex min-h-[150px] items-center justify-center border-2 border-dashed border-zinc-400 bg-zinc-100/50 p-8 text-center">
            <span className="text-secondary text-sm font-medium">Grid Item 2</span>
          </div>
          <div className="flex min-h-[150px] items-center justify-center border-2 border-dashed border-zinc-400 bg-zinc-100/50 p-8 text-center">
            <span className="text-secondary text-sm font-medium">Grid Item 3</span>
          </div>
        </section>

        {/* Split Content Section */}
        <section
          aria-label="Split Content Section"
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          <div className="flex min-h-[200px] items-center justify-center border-2 border-dashed border-zinc-400 bg-zinc-100/50 p-10 text-center">
            <span className="text-secondary text-sm font-medium">Split Column Left</span>
          </div>
          <div className="flex min-h-[200px] items-center justify-center border-2 border-dashed border-zinc-400 bg-zinc-100/50 p-10 text-center">
            <span className="text-secondary text-sm font-medium">Split Column Right</span>
          </div>
        </section>

        {/* Cards Section */}
        <section
          aria-label="Cards Section"
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          <div className="flex min-h-[120px] items-center justify-center border-2 border-dashed border-zinc-400 bg-zinc-100/50 p-6 text-center">
            <span className="text-secondary text-xs font-medium">Card Item 1</span>
          </div>
          <div className="flex min-h-[120px] items-center justify-center border-2 border-dashed border-zinc-400 bg-zinc-100/50 p-6 text-center">
            <span className="text-secondary text-xs font-medium">Card Item 2</span>
          </div>
          <div className="flex min-h-[120px] items-center justify-center border-2 border-dashed border-zinc-400 bg-zinc-100/50 p-6 text-center">
            <span className="text-secondary text-xs font-medium">Card Item 3</span>
          </div>
          <div className="flex min-h-[120px] items-center justify-center border-2 border-dashed border-zinc-400 bg-zinc-100/50 p-6 text-center">
            <span className="text-secondary text-xs font-medium">Card Item 4</span>
          </div>
        </section>
      </main>

      {/* Footer Area */}
      <footer
        role="contentinfo"
        aria-label="Footer"
        className="mx-auto w-full px-4 pb-8 transition-all duration-500 ease-in-out sm:max-w-screen-sm md:max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl"
      >
        <div className="text-secondary border-2 border-dashed border-zinc-400 bg-zinc-100/50 p-6 text-center text-sm font-medium">
          Footer
        </div>
      </footer>
    </div>
  );
}
