import ProjectsPageClient from "../../components/ProjectsPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore all portfolio projects built by Tristan Budd.",
  alternates: {
    canonical: "https://tristanbudd.com/projects",
  },
};

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}
