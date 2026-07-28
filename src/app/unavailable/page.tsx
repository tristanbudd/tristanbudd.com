import type { Metadata } from "next";
import UnavailableClient from "./UnavailableClient";

export const metadata: Metadata = {
  title: "Unavailable in Your Region",
  description: "Access to this website is restricted in your geographic location.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UnavailablePage() {
  const allowedCountries = process.env.ALLOWED_COUNTRIES || "GB";
  return <UnavailableClient allowedCountries={allowedCountries} />;
}
