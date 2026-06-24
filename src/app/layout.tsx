/**
 * @file layout.tsx
 * @description Root layout shared across all routes. Sets up fonts, metadata, and viewport config.
 */

import type { Metadata, Viewport } from "next";
import { Cinzel, Geist, Geist_Mono, Outfit, Syne } from "next/font/google";

import PageLoader from "@/components/PageLoader";
import ScreenSizeNotice from "@/components/ScreenSizeNotice";
import ScrollInit from "@/components/ScrollInit";
import GoogleTagManager from "@/components/GoogleTagManager";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tristanbudd.com"),
  alternates: {
    canonical: "https://tristanbudd.com",
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: "Tristan Budd - Blog RSS Feed" }],
    },
  },
  title: {
    default: "Tristan Budd",
    template: "Tristan Budd - %s",
  },
  description: "Tristan Budd - Software Engineer. Personal portfolio and professional showcase.",
  keywords: ["Tristan Budd", "Software Engineer", "Portfolio", "Web Developer"],
  authors: [{ name: "Tristan Budd", url: "https://tristanbudd.com" }],
  creator: "Tristan Budd",
  appleWebApp: {
    title: "Tristan Budd",
    statusBarStyle: "default",
    capable: true,
  },
  openGraph: {
    type: "website",
    siteName: "Tristan Budd",
    title: "Tristan Budd",
    description: "Software Engineer. Personal portfolio and professional showcase.",
    url: "https://tristanbudd.com",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Tristan Budd - Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tristan Budd",
    description: "Software Engineer. Personal portfolio and professional showcase.",
    images: ["/api/og"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.GTM_ID;

  return (
    <html
      lang="en-GB"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} ${cinzel.variable} ${outfit.variable} h-full scroll-smooth antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <GoogleTagManager gtmId={gtmId} />
        <Providers>
          <ScrollInit />
          <PageLoader />
          <ScreenSizeNotice />
          {children}
        </Providers>
      </body>
    </html>
  );
}
