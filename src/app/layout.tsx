/**
 * @file layout.tsx
 * @description Root layout shared across all routes. Sets up fonts, metadata, and viewport config.
 */

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tristanbudd.com"),
  title: {
    default: "Tristan Budd",
    template: "Tristan Budd - %s",
  },
  description: "Tristan Budd - Software Engineer. Personal portfolio and professional showcase.",
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FEFEFE" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
