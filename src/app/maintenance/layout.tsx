import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Under Maintenance",
  description:
    "This website is currently undergoing scheduled maintenance. Please check back later.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MaintenanceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
