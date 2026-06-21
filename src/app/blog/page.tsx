import BlogPageClient from "../../components/BlogPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read articles and technical insights on software engineering and UX design by Tristan Budd.",
};

export default function BlogPage() {
  return <BlogPageClient />;
}
