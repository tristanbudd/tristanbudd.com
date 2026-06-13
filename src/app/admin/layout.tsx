import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Admin",
  description: "Administrative dashboard for tristanbudd.com",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
