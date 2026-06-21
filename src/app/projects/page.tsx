import ProjectsPageClient from "../../components/ProjectsPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore all portfolio projects built by Tristan Budd.",
};

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}
