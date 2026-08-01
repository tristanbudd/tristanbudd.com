"use client";

/**
 * @file Footer.tsx
 * @description Responsive footer component with parameters for navigation links and social connections.
 */

import { trackCTA, trackNavigation } from "@/lib/gtm";
import { useLenis } from "lenis/react";
import { ArrowUp, Github, Globe, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { RiOpenaiFill } from "react-icons/ri";
import { SiAnthropic, SiGmail, SiGooglegemini, SiNpm, SiPerplexity } from "react-icons/si";
import packageJson from "../../package.json";
import { useTransition } from "../context/TransitionContext";

const footerSlugIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  npm: SiNpm,
  gmail: SiGmail,
};

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export interface FooterSocial {
  platform: string;
  iconSlug?: string; // Optional if using a built-in Lucide icon
  href: string;
  ariaLabel: string;
}

export interface FooterProps {
  tagline?: string;
  navGroups?: FooterLinkGroup[];
  socials?: FooterSocial[];
  pageContext?: string;
}

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
  twitter: Twitter,
  website: Globe,
};

export default function Footer({
  tagline = "An aspiring software developer & engineer with a strong foundation in building robust digital solutions.",
  navGroups = [],
  socials = [],
  pageContext,
}: FooterProps) {
  const lenis = useLenis();
  const { triggerTransition } = useTransition();
  const pathname = usePathname() || "";

  const pageUrl = `https://tristanbudd.com${pathname}`;

  const baseContext = `You are helping a visitor explore tristanbudd.com, the portfolio of Tristan Budd, a software engineer and developer based in the UK. The site includes project case studies, technical blog articles, work experience, education, tech stack, and certifications. An llms.txt overview is at https://tristanbudd.com/llms.txt.`;

  let explainPrompt: string;
  if (pageContext) {
    explainPrompt = `${baseContext}\n\nThe visitor is currently on this page:\n\n${pageContext}\n\nURL: ${pageUrl}\n\nGreet the visitor, give them a brief overview of what this page contains based on the above, and let them know they can ask you anything about the content: the project, the work, the technical details, or anything else they are curious about.`;
  } else if (pathname.startsWith("/projects/")) {
    explainPrompt = `${baseContext}\n\nThe visitor is currently reading a project case study. URL: ${pageUrl}\n\nGreet them, let them know you can help them explore this project (what it does, how it was built, the technical decisions involved), and invite them to ask anything.`;
  } else if (pathname.startsWith("/blog/")) {
    explainPrompt = `${baseContext}\n\nThe visitor is currently reading a blog article. URL: ${pageUrl}\n\nGreet them and let them know you can help them dig into the article's content, discuss the ideas covered, or answer any questions they have about it.`;
  } else if (pathname === "/projects") {
    explainPrompt = `${baseContext}\n\nThe visitor is browsing the projects showcase. URL: ${pageUrl}\n\nGreet them and let them know you can help them navigate the projects, understand what each one involves, or answer any questions about Tristan's work.`;
  } else if (pathname === "/blog") {
    explainPrompt = `${baseContext}\n\nThe visitor is browsing the blog. URL: ${pageUrl}\n\nGreet them and let them know you can help them find articles of interest, understand topics covered, or answer questions about the content.`;
  } else {
    explainPrompt = `${baseContext}\n\nThe visitor is on: ${pageUrl}\n\nGreet them and let them know you can help them explore the portfolio, whether they want to learn about Tristan's projects, experience, skills, or anything else on the site.`;
  }
  const encodedPrompt = encodeURIComponent(explainPrompt);

  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    trackCTA("Back to Top");
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, label: string) => {
    trackNavigation(label, href);
    const triggered = triggerTransition(href);
    if (triggered) {
      e.preventDefault();
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      aria-label="Footer"
      className="font-outfit 3xl:max-w-440 4xl:max-w-560 5xl:max-w-720 3xl:mt-24 3xl:pt-20 3xl:pb-12 4xl:mt-32 4xl:pt-24 4xl:pb-16 5xl:mt-40 5xl:pt-32 5xl:pb-24 mx-auto mt-16 w-full border-t border-zinc-200/60 px-4 pt-12 pb-8 transition-all duration-500 ease-in-out sm:max-w-screen-sm md:max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl"
    >
      <div className="3xl:gap-y-16 3xl:gap-x-12 4xl:gap-y-20 4xl:gap-x-16 5xl:gap-y-28 5xl:gap-x-24 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
        {/* Brand Block */}
        <div className="3xl:gap-6 4xl:gap-8 5xl:gap-10 col-span-2 flex flex-col items-start gap-4 lg:col-span-2">
          <Link
            href="/"
            onClick={() => trackNavigation("Footer Logo", "/")}
            aria-label="Tristan Budd Home"
            className="group 3xl:gap-4 4xl:gap-5 5xl:gap-6 -m-1 flex cursor-pointer items-center gap-2 rounded-lg p-1 text-current select-none focus:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 sm:gap-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 736 708"
              fill="none"
              className="3xl:h-13 4xl:h-16 5xl:h-20 h-8 w-auto fill-current text-current transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-2 sm:h-10"
            >
              <g clipPath="url(#clip0_152_29_footer)">
                <path d="M466 120H293V708H171V120H0V0H466V120Z" fill="currentColor" />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M736 607L635 708H328V156H450V294H570L614 250V158L577 120H502V0H635L736 101V294L674 354L736 414V607ZM450 414V588H577L614 550V458L570 414H450Z"
                  fill="currentColor"
                />
              </g>
              <defs>
                <clipPath id="clip0_152_29_footer">
                  <rect width="736" height="708" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <div className="3xl:text-3xl 4xl:text-4xl 5xl:text-5xl relative h-[1.7em] w-fit overflow-hidden text-xl leading-[0.85] font-extrabold tracking-normal uppercase select-none sm:text-2xl">
              <div className="flex h-[1.7em] flex-col justify-center pr-4 text-left text-current transition-[color,transform] duration-300 group-hover:translate-x-0.5 group-hover:text-zinc-800">
                <span>Tristan</span>
                <span>Budd</span>
              </div>
            </div>
          </Link>
          <p className="3xl:max-w-xl 3xl:text-lg 4xl:max-w-2xl 4xl:text-xl 5xl:max-w-3xl 5xl:text-2xl max-w-xs text-sm leading-relaxed font-medium text-zinc-500 sm:max-w-sm sm:text-base xl:max-w-md">
            {tagline}
          </p>

          {/* Social Links */}
          {socials.length > 0 && (
            <div className="3xl:mt-4 3xl:gap-4.5 4xl:mt-5 4xl:gap-6 5xl:mt-7 5xl:gap-8 mt-2.5 flex items-center gap-3 xl:gap-4">
              {socials.map((social) => {
                const IconComponent = socialIcons[social.platform.toLowerCase()];
                return (
                  <a
                    key={social.platform}
                    href={social.href}
                    target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={social.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    onClick={() => trackCTA(`Footer Social: ${social.platform}`, social.href)}
                    aria-label={social.ariaLabel}
                    id={`footer-social-${social.platform}`}
                    className="group/social text-zinc-650 3xl:h-14 3xl:w-14 4xl:h-16 4xl:w-16 5xl:h-20 5xl:w-20 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200/80 bg-white/40 backdrop-blur-xs transition-all duration-300 hover:scale-105 hover:border-black hover:bg-black hover:text-white focus:outline-hidden focus-visible:bg-black focus-visible:text-white focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 xl:h-12 xl:w-12"
                  >
                    {IconComponent ? (
                      <IconComponent
                        className="3xl:h-6.5 3xl:w-6.5 4xl:h-7.5 4xl:w-7.5 5xl:h-9 5xl:w-9 h-4.5 w-4.5 transition-transform duration-300 group-hover/social:scale-110 xl:h-5.5 xl:w-5.5"
                        aria-hidden="true"
                      />
                    ) : social.iconSlug ? (
                      (() => {
                        const SlugIcon = footerSlugIconMap[social.iconSlug.toLowerCase()];
                        return SlugIcon ? (
                          <SlugIcon
                            className="footer-social-icon 3xl:h-6.5 3xl:w-6.5 4xl:h-7.5 4xl:w-7.5 5xl:h-9 5xl:w-9 h-4.5 w-4.5 transition-all duration-350 group-hover/social:scale-110 group-hover/social:brightness-0 group-hover/social:invert group-focus-visible/social:brightness-0 group-focus-visible/social:invert xl:h-5.5 xl:w-5.5"
                            aria-hidden="true"
                          />
                        ) : null;
                      })()
                    ) : null}
                  </a>
                );
              })}
            </div>
          )}

          {/* Explain with AI (Icons Only) */}
          <div className="mt-2.5 flex flex-col gap-1">
            <span className="text-[9px] font-bold tracking-widest text-zinc-500 uppercase">
              Explain Page with AI
            </span>
            <div className="flex items-center gap-1.5">
              <a
                href={`https://chatgpt.com/?q=${encodedPrompt}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Explain this page with ChatGPT"
                className="group/llm text-zinc-650 flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white/40 backdrop-blur-xs transition-all duration-300 hover:scale-105 hover:border-black hover:bg-black hover:text-white focus:outline-hidden focus-visible:bg-black focus-visible:text-white focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 xl:h-9 xl:w-9"
              >
                <RiOpenaiFill className="h-3.5 w-3.5 transition-transform duration-300 group-hover/llm:scale-110 xl:h-4 xl:w-4" />
              </a>
              <a
                href={`https://claude.ai/new?q=${encodedPrompt}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Explain this page with Claude"
                className="group/llm text-zinc-650 flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white/40 backdrop-blur-xs transition-all duration-300 hover:scale-105 hover:border-black hover:bg-black hover:text-white focus:outline-hidden focus-visible:bg-black focus-visible:text-white focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 xl:h-9 xl:w-9"
              >
                <SiAnthropic className="h-3.5 w-3.5 transition-transform duration-300 group-hover/llm:scale-110 xl:h-4 xl:w-4" />
              </a>
              {/* TODO: Add Gemini button here if Google adds URL prompt pre-fill support */}
              <a
                href={`https://www.perplexity.ai/?q=${encodedPrompt}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Explain this page with Perplexity"
                className="group/llm text-zinc-650 flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white/40 backdrop-blur-xs transition-all duration-300 hover:scale-105 hover:border-black hover:bg-black hover:text-white focus:outline-hidden focus-visible:bg-black focus-visible:text-white focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 xl:h-9 xl:w-9"
              >
                <SiPerplexity className="h-3.5 w-3.5 transition-transform duration-300 group-hover/llm:scale-110 xl:h-4 xl:w-4" />
              </a>
            </div>
          </div>

          {/* Version */}
          <div className="3xl:text-xl 4xl:text-2xl 5xl:text-3xl mt-2.5 text-base font-semibold tracking-tight text-zinc-500 select-none">
            v{packageJson.version}
          </div>
        </div>

        {/* Links Groups */}
        {navGroups.map((group) => (
          <div key={group.title} className="3xl:gap-6 4xl:gap-8 5xl:gap-10 flex flex-col gap-4">
            <span className="3xl:text-base 4xl:text-lg 5xl:text-xl text-xs font-bold tracking-widest text-black uppercase xl:text-sm">
              {group.title}
            </span>
            <nav
              className="3xl:gap-4 4xl:gap-5 5xl:gap-6 flex flex-col gap-2.5"
              aria-label={`Footer Navigation ${group.title}`}
            >
              {group.links.map((link) => (
                <div key={link.label} className="w-fit">
                  <Link
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href, link.label)}
                    id={`footer-link-${group.title.toLowerCase().replace(/\s+/g, "-")}-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                    className="3xl:text-lg 4xl:text-xl 5xl:text-2xl relative -mx-1 -my-0.5 block rounded-sm px-1 py-0.5 text-sm font-semibold text-zinc-500 transition-colors duration-200 after:absolute after:bottom-0.5 after:left-1 after:h-0.5 after:w-[calc(100%-8px)] after:origin-center after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:text-black hover:after:scale-x-100 focus:outline-hidden focus-visible:text-black focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:after:scale-x-100 xl:text-base"
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="3xl:mt-20 3xl:pt-12 3xl:gap-10 4xl:mt-24 4xl:pt-16 4xl:gap-12 5xl:mt-32 5xl:pt-20 5xl:gap-16 mt-12 flex flex-col items-start justify-between gap-6 border-t border-zinc-200/50 pt-8 sm:flex-row sm:items-center">
        <div className="3xl:gap-3 4xl:gap-4 5xl:gap-5 flex flex-col items-start gap-2">
          <p className="3xl:text-base 4xl:text-lg 5xl:text-xl text-xs font-medium text-zinc-500 xl:text-sm">
            &copy; {currentYear} Tristan Budd. All rights reserved.
          </p>
          <p className="3xl:text-sm 4xl:text-base 5xl:text-lg text-[10px] font-semibold tracking-wider text-zinc-500 uppercase xl:text-xs">
            Built with Next.js, React &amp; Tailwind CSS
          </p>
        </div>

        {/* Back to Top */}
        <button
          onClick={handleScrollToTop}
          aria-label="Scroll to top of page"
          id="footer-back-to-top"
          className="group/top text-zinc-650 3xl:h-14 3xl:w-14 4xl:h-16 4xl:w-16 5xl:h-20 5xl:w-20 flex h-10 w-10 items-center justify-center self-start rounded-full border border-zinc-200/80 bg-white/40 backdrop-blur-xs transition-all duration-300 hover:scale-105 hover:border-black hover:bg-black hover:text-white focus:outline-hidden focus-visible:bg-black focus-visible:text-white focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 sm:self-auto xl:h-12 xl:w-12"
        >
          <ArrowUp className="3xl:h-6.5 3xl:w-6.5 4xl:h-7.5 4xl:w-7.5 5xl:h-9 5xl:w-9 h-4.5 w-4.5 transition-transform duration-300 group-hover/top:-translate-y-0.5 xl:h-5.5 xl:w-5.5" />
        </button>
      </div>
    </footer>
  );
}
