import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

function formatPubDate(publishedAt: string, createdAt: Date): string {
  try {
    const parsed = new Date(publishedAt);
    if (!isNaN(parsed.getTime())) {
      return parsed.toUTCString();
    }
  } catch {
    // Ignore error and fall back
  }
  try {
    const parsedCreated = new Date(createdAt);
    if (!isNaN(parsedCreated.getTime())) {
      return parsedCreated.toUTCString();
    }
  } catch {
    // Ignore and return now
  }
  return new Date().toUTCString();
}

export async function GET() {
  try {
    const blogs = await prisma.blogPost.findMany();

    // Sort by publication date descending
    blogs.sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime() || new Date(a.createdAt).getTime() || 0;
      const dateB = new Date(b.publishedAt).getTime() || new Date(b.createdAt).getTime() || 0;
      return dateB - dateA;
    });

    const feedItems = blogs
      .map((post) => {
        const pubDateStr = formatPubDate(post.publishedAt, post.createdAt);
        const postUrl = `https://tristanbudd.com/blog/${post.slug}`;

        return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDateStr}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
      <category>${escapeXml(post.category)}</category>
    </item>`;
      })
      .join("");

    const feedXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Tristan Budd - Blog &amp; Articles</title>
    <link>https://tristanbudd.com/blog</link>
    <description>Read articles and technical insights on software engineering and UX design by Tristan Budd.</description>
    <language>en-gb</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://tristanbudd.com/feed.xml" rel="self" type="application/rss+xml" />
    ${feedItems}
  </channel>
</rss>`;

    return new Response(feedXml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    return new Response("Error generating RSS feed", { status: 500 });
  }
}
