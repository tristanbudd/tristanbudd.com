import { useLenis } from "lenis/react";
import { ArrowRight, ChevronDown, Loader2, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export interface NavItem {
  label: string;
  href: string;
  dropdownItems?: { label: string; href: string }[];
}

export interface HeaderProps {
  navItems?: NavItem[];
  ctaText?: string;
  ctaHref?: string;
}

export default function Header({
  navItems = [],
  ctaText = "Placeholder CTA",
  ctaHref = "#",
}: HeaderProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  const lenis = useLenis();

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isRefreshing) return;
    setIsRefreshing(true);
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    const handleResize = () => {
      const logoWidth = logoRef.current?.offsetWidth || 220;
      const navCtaWidth = measureRef.current?.offsetWidth || 580;
      const outerPadding = 32; // px (px-4 on both sides)
      const leeway = 64; // px

      const totalRequiredWidth = logoWidth + leeway + navCtaWidth + outerPadding;

      const getContainerMaxWidth = (w: number) => {
        if (w < 640) return w;
        if (w < 768) return 640;
        if (w < 1024) return 768;
        if (w < 1280) return 1024;
        if (w < 1536) return 1152;
        return 1280;
      };

      const availableWidth = getContainerMaxWidth(window.innerWidth) - outerPadding;

      if (availableWidth < totalRequiredWidth) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
        setMobileMenuOpen(false);
        setOpenMobileDropdown(null);
      }

      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // Initial measurements
    handleScroll();
    handleResize();

    // Re-run measurement when fonts are ready to ensure perfect rendering widths
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        handleResize();
      });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [navItems]);

  useEffect(() => {
    if (mobileMenuOpen && isMobile === true) {
      document.body.classList.add("mobile-menu-active");
      lenis?.stop();
    } else {
      document.body.classList.remove("mobile-menu-active");
      lenis?.start();
    }
    return () => {
      document.body.classList.remove("mobile-menu-active");
      lenis?.start();
    };
  }, [mobileMenuOpen, isMobile, lenis]);

  const toggleMobileDropdown = (label: string) => {
    setOpenMobileDropdown(openMobileDropdown === label ? null : label);
  };

  return (
    <>
      {/* Hidden offscreen element for dynamic breakpoint measurement */}
      <div
        ref={measureRef}
        className="font-outfit pointer-events-none invisible absolute flex items-center gap-8 text-[15px] whitespace-nowrap"
        style={{ left: "-9999px", top: "-9999px" }}
      >
        <div className="flex items-center gap-8 font-semibold">
          {navItems.map((item) => (
            <span key={item.label} className="flex items-center gap-1 whitespace-nowrap">
              {item.label}
              {item.dropdownItems && <ChevronDown className="h-4 w-4" />}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between gap-4 rounded-full border-2 border-black bg-black py-1.5 pr-1.5 pl-6 text-sm font-semibold whitespace-nowrap text-white">
          <span className="whitespace-nowrap">{ctaText}</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800">
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>

      <header
        ref={headerRef}
        role="banner"
        className={`font-outfit sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled || mobileMenuOpen
            ? "border-b border-zinc-200/80 bg-white/95 text-black shadow-xs backdrop-blur-md"
            : "border-b border-transparent bg-transparent text-black"
        }`}
      >
        <div
          className={`mx-auto flex w-full items-center justify-between gap-16 px-4 transition-all duration-500 ease-in-out sm:max-w-screen-sm md:max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl ${
            scrolled ? "py-4" : "pt-6 pb-4 sm:pt-14"
          }`}
        >
          {/* Left Logo and Brand Name */}
          <div ref={logoRef}>
            <Link
              href="/"
              onClick={handleLogoClick}
              className="group flex cursor-pointer items-center gap-2 text-current select-none sm:gap-3"
            >
              {isRefreshing ? (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center sm:h-10 sm:w-10">
                  <Loader2 className="text-zinc-650 h-7 w-7 animate-spin sm:h-9 sm:w-9" />
                </div>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 736 708"
                  fill="none"
                  className="h-8 w-auto fill-current text-current transition-all duration-300 group-hover:scale-105 group-hover:-rotate-2 sm:h-10"
                >
                  <g clipPath="url(#clip0_152_29)">
                    <path d="M466 120H293V708H171V120H0V0H466V120Z" fill="currentColor" />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M736 607L635 708H328V156H450V294H570L614 250V158L577 120H502V0H635L736 101V294L674 354L736 414V607ZM450 414V588H577L614 550V458L570 414H450Z"
                      fill="currentColor"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_152_29">
                      <rect width="736" height="708" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              )}
              <div className="relative h-8 w-fit overflow-hidden select-none sm:h-10">
                <div
                  className={`flex flex-col transition-transform duration-300 ease-in-out ${isRefreshing ? "-translate-y-1/2" : "translate-y-0"}`}
                >
                  <div className="flex h-8 flex-col justify-center pr-4 text-left text-xl leading-[0.85] font-extrabold tracking-normal text-current uppercase transition-colors duration-300 group-hover:translate-x-1 group-hover:text-zinc-800 sm:h-10 sm:text-2xl">
                    <span>Tristan</span>
                    <span>Budd</span>
                  </div>
                  <div className="text-zinc-650 flex h-8 flex-col justify-center pr-4 text-left text-xl leading-[0.85] font-extrabold tracking-normal uppercase sm:h-10 sm:text-2xl">
                    <span>Refreshing</span>
                    <span>Page...</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Right Menu / Burger Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close main navigation menu" : "Open main navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            className={`h-12 w-12 cursor-pointer items-center justify-center rounded-md text-current transition-colors focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current ${
              isMobile === null ? "flex xl:hidden" : isMobile ? "flex" : "hidden"
            }`}
          >
            {mobileMenuOpen ? (
              <X className="h-8 w-8 rotate-90 text-current transition-transform duration-250" />
            ) : (
              <Menu className="h-8 w-8 text-current transition-transform duration-250" />
            )}
          </button>

          <div
            className={`items-center gap-8 ${
              isMobile === null ? "hidden xl:flex" : isMobile ? "hidden" : "flex"
            }`}
          >
            <nav
              role="navigation"
              aria-label="Main Navigation"
              className="flex items-center gap-8 text-[15px] font-semibold text-zinc-900"
            >
              {navItems.map((item) => (
                <div key={item.label} className="group relative py-2">
                  {item.dropdownItems ? (
                    <>
                      <button
                        aria-haspopup="true"
                        aria-expanded="false"
                        className="relative flex cursor-pointer items-center gap-1 rounded-xs whitespace-nowrap transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-center after:scale-x-0 after:bg-black after:transition-transform after:duration-300 group-hover:after:scale-x-100 hover:text-black focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                      >
                        <span>{item.label}</span>
                        <ChevronDown className="h-4.5 w-4.5 text-black transition-transform duration-200 group-hover:rotate-180" />
                      </button>
                      {/* Dropdown Menu Panel */}
                      <div className="invisible absolute top-full left-0 z-50 w-52 translate-y-2 pt-2 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                        <div
                          role="menu"
                          className="flex flex-col rounded-none border-x border-t-2 border-b border-zinc-200/80 border-t-black bg-white/95 py-2 text-left shadow-lg backdrop-blur-md"
                        >
                          {item.dropdownItems.map((subItem) => (
                            <Link
                              key={subItem.label}
                              href={subItem.href}
                              role="menuitem"
                              className="group/item relative flex items-center justify-between px-5 py-2.5 text-[14px] font-semibold whitespace-nowrap text-zinc-700 transition-all duration-200 hover:bg-zinc-50 hover:text-black focus:outline-hidden focus-visible:bg-zinc-50 focus-visible:text-black"
                            >
                              <span className="transition-transform duration-200 group-hover/item:translate-x-1">
                                {subItem.label}
                              </span>
                              <ArrowRight className="h-3.5 w-3.5 -translate-x-1 text-black opacity-0 transition-all duration-200 group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="relative rounded-xs py-2 whitespace-nowrap transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-center after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:text-black hover:after:scale-x-100 focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
            <a
              href={ctaHref}
              className="group/btn relative flex items-center justify-between gap-4 overflow-hidden rounded-full border-2 border-black bg-black py-1.5 pr-1.5 pl-6 text-sm font-semibold text-white transition-all duration-300 hover:text-black focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              {/* Sliding background */}
              <span className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-300 ease-out group-hover/btn:scale-x-100" />

              <span className="relative z-10 whitespace-nowrap transition-colors duration-300">
                {ctaText}
              </span>
              <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-white transition-colors duration-300 group-hover/btn:bg-black">
                <ArrowRight className="h-4 w-4 transition-all duration-300 group-hover/btn:-rotate-45" />
              </div>
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu Panel */}
      <div
        id="mobile-navigation"
        data-lenis-prevent
        aria-hidden={!mobileMenuOpen}
        inert={!mobileMenuOpen}
        className={`fixed inset-x-0 bottom-0 z-40 border-b border-zinc-200 bg-white/98 backdrop-blur-xl transition-all duration-300 ease-in-out ${
          isMobile === true && mobileMenuOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        } overflow-y-auto`}
        style={{ top: `${headerHeight}px` }}
      >
        {/* Inner container aligned to the design column constraints */}
        <div className="mx-auto flex h-full w-full flex-col justify-between px-4 py-6 sm:max-w-screen-sm md:max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">
          <nav className="flex w-full flex-col gap-4">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="flex flex-col border-b border-zinc-100 pb-2.5 last:border-0 last:pb-0"
              >
                {item.dropdownItems ? (
                  <>
                    <button
                      onClick={() => toggleMobileDropdown(item.label)}
                      aria-expanded={openMobileDropdown === item.label}
                      aria-controls={`mobile-submenu-${item.label}`}
                      className="group/item flex w-full cursor-pointer items-center justify-between rounded-md px-4 py-2.5 text-base font-bold tracking-wider text-zinc-900 transition-all duration-200 hover:bg-zinc-50 hover:text-black focus:outline-hidden focus-visible:bg-zinc-50"
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`mr-3 h-6 w-6 text-black transition-transform duration-300 ${
                          openMobileDropdown === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      id={`mobile-submenu-${item.label}`}
                      className={`mt-2 ml-4 flex flex-col gap-1 overflow-hidden transition-all duration-300 ease-in-out ${
                        openMobileDropdown === item.label
                          ? "max-h-[250px] py-1 opacity-100"
                          : "pointer-events-none max-h-0 opacity-0"
                      }`}
                    >
                      {item.dropdownItems.map((subItem) => (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="group/subitem flex items-center justify-between rounded-md py-2.5 pr-2 pl-4 text-sm font-semibold whitespace-nowrap text-zinc-700 transition-all duration-200 hover:bg-zinc-50 hover:text-black focus:outline-hidden focus-visible:bg-zinc-50 focus-visible:text-black"
                        >
                          <span className="transition-transform duration-200 group-hover/subitem:translate-x-1">
                            {subItem.label}
                          </span>
                          <ArrowRight className="mr-3 h-4 w-4 -translate-x-1 text-black opacity-0 transition-all duration-200 group-hover/subitem:translate-x-0 group-hover/subitem:opacity-100" />
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="group/item flex w-full items-center justify-between rounded-md px-4 py-2.5 text-base font-bold tracking-wider text-zinc-900 transition-all duration-200 hover:bg-zinc-50 hover:text-black focus:outline-hidden focus-visible:bg-zinc-50"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="mr-3 h-5 w-5 -translate-x-1 text-black opacity-0 transition-all duration-200 group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                  </Link>
                )}
              </div>
            ))}
          </nav>
          <div className="mt-auto w-full pt-8 pb-8">
            <a
              href={ctaHref}
              onClick={() => setMobileMenuOpen(false)}
              className="group/btn relative flex items-center justify-between gap-4 overflow-hidden rounded-full border-2 border-black bg-black py-1.5 pr-1.5 pl-6 text-sm font-semibold text-white shadow-xs transition-all duration-300 hover:text-black focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              {/* Sliding background */}
              <span className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-300 ease-out group-hover/btn:scale-x-100" />

              <span className="relative z-10 whitespace-nowrap transition-colors duration-300">
                {ctaText}
              </span>
              <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-white transition-colors duration-300 group-hover/btn:bg-black">
                <ArrowRight className="h-4 w-4 transition-all duration-300 group-hover/btn:-rotate-45" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
