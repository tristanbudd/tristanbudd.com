"use client";

/**
 * @file Footer.tsx
 * @description Responsive footer component with parameters for navigation links and social connections.
 */

import { useLenis } from "lenis/react";
import { ArrowUp, Github, Globe, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";
import React from "react";

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
}: FooterProps) {
  const lenis = useLenis();

  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
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
            aria-label="Tristan Budd Home"
            className="group 3xl:gap-4 4xl:gap-5 5xl:gap-6 flex cursor-pointer items-center gap-2 text-current select-none sm:gap-3"
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
            <div className="3xl:mt-6 3xl:gap-4.5 4xl:mt-8 4xl:gap-6 5xl:mt-10 5xl:gap-8 mt-4 flex items-center gap-3 xl:gap-4">
              {socials.map((social) => {
                const IconComponent = socialIcons[social.platform.toLowerCase()];
                return (
                  <a
                    key={social.platform}
                    href={social.href}
                    target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={social.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    aria-label={social.ariaLabel}
                    id={`footer-social-${social.platform}`}
                    className="group/social text-zinc-650 3xl:h-14 3xl:w-14 4xl:h-16 4xl:w-16 5xl:h-20 5xl:w-20 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200/80 bg-white/40 backdrop-blur-xs transition-all duration-300 hover:scale-105 hover:border-black hover:bg-black hover:text-white xl:h-12 xl:w-12"
                  >
                    {IconComponent ? (
                      <IconComponent className="3xl:h-6.5 3xl:w-6.5 4xl:h-7.5 4xl:w-7.5 5xl:h-9 5xl:w-9 h-4.5 w-4.5 transition-transform duration-300 group-hover/social:scale-110 xl:h-5.5 xl:w-5.5" />
                    ) : social.iconSlug ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={`https://cdn.simpleicons.org/${social.iconSlug}`}
                        alt={social.platform}
                        width={18}
                        height={18}
                        loading="lazy"
                        className="footer-social-icon 3xl:h-6.5 3xl:w-6.5 4xl:h-7.5 4xl:w-7.5 5xl:h-9 5xl:w-9 h-4.5 w-4.5 transition-all duration-350 group-hover/social:scale-110 xl:h-5.5 xl:w-5.5"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : null}
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Links Groups */}
        {navGroups.map((group) => (
          <div key={group.title} className="3xl:gap-6 4xl:gap-8 5xl:gap-10 flex flex-col gap-4">
            <span className="3xl:text-base 4xl:text-lg 5xl:text-xl text-xs font-bold tracking-widest text-zinc-400 uppercase xl:text-sm">
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
                    id={`footer-link-${group.title.toLowerCase().replace(/\s+/g, "-")}-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                    className="3xl:text-lg 4xl:text-xl 5xl:text-2xl relative block py-1 text-sm font-semibold text-zinc-500 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-center after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:text-black hover:after:scale-x-100 xl:text-base"
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
          <p className="3xl:text-sm 4xl:text-base 5xl:text-lg text-[10px] font-semibold tracking-wider text-zinc-400 uppercase xl:text-xs">
            Built with Next.js, React &amp; Tailwind CSS
          </p>
        </div>

        {/* Back to Top */}
        <button
          onClick={handleScrollToTop}
          aria-label="Scroll to top of page"
          id="footer-back-to-top"
          className="group/top text-zinc-650 3xl:h-14 3xl:w-14 4xl:h-16 4xl:w-16 5xl:h-20 5xl:w-20 flex h-10 w-10 items-center justify-center self-start rounded-full border border-zinc-200/80 bg-white/40 backdrop-blur-xs transition-all duration-300 hover:scale-105 hover:border-black hover:bg-black hover:text-white sm:self-auto xl:h-12 xl:w-12"
        >
          <ArrowUp className="3xl:h-6.5 3xl:w-6.5 4xl:h-7.5 4xl:w-7.5 5xl:h-9 5xl:w-9 h-4.5 w-4.5 transition-transform duration-300 group-hover/top:-translate-y-0.5 xl:h-5.5 xl:w-5.5" />
        </button>
      </div>
    </footer>
  );
}
